package emailverifier

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"net"
	"net/smtp"
	"net/url"
	"strings"
	"sync"
	"time"

	"golang.org/x/net/proxy"
)

type SMTP struct {
	HostExists  bool `json:"host_exists"`
	FullInbox   bool `json:"full_inbox"`
	CatchAll    bool `json:"catch_all"`
	Deliverable bool `json:"deliverable"`
	Disabled    bool `json:"disabled"`
}

func (v *Verifier) CheckSMTP(domain, username string) (*SMTP, error) {
	if !v.smtpCheckEnabled {
		return nil, nil
	}

	var ret SMTP
	var err error
	email := fmt.Sprintf("%s@%s", username, domain)

	client, mx, err := newSMTPClient(domain, v.proxyURI, v.localAddr, v.connectTimeout, v.operationTimeout)
	if err != nil {
		return &ret, ParseSMTPError(err)
	}

	defer client.Close()

	for _, apiVerifier := range v.apiVerifiers {
		if apiVerifier.isSupported(strings.ToLower(mx.Host)) {
			return apiVerifier.check(domain, username)
		}
	}

	if err = client.Hello(v.helloName); err != nil {
		return &ret, ParseSMTPError(err)
	}

	if err = client.Mail(v.fromEmail); err != nil {
		return &ret, ParseSMTPError(err)
	}

	ret.HostExists = true
	ret.CatchAll = true

	if v.catchAllCheckEnabled {
		isCatchAll := true
		for _, randomEmail := range GenerateSmartRandomEmails(domain, 2) {
			if err = client.Rcpt(randomEmail); err != nil {
				if e := ParseSMTPError(err); e != nil {
					switch e.Message {
					case ErrFullInbox:
						ret.FullInbox = true
					case ErrNotAllowed:
						ret.Disabled = true
					case ErrServerUnavailable:
						isCatchAll = false
					}
				}
				if !isCatchAll {
					break
				}
			}
		}
		ret.CatchAll = isCatchAll
		if ret.CatchAll {
			return &ret, nil
		}
	}

	if username == "" {
		return &ret, nil
	}

	if err = client.Rcpt(email); err == nil {
		ret.Deliverable = true
	}

	return &ret, nil
}

func newSMTPClient(domain, proxyURI, localAddr string, connectTimeout, operationTimeout time.Duration) (*smtp.Client, *net.MX, error) {
	domain = domainToASCII(domain)
	mxRecords, err := net.LookupMX(domain)
	if err != nil {
		return nil, nil, err
	}

	if len(mxRecords) == 0 {
		return nil, nil, errors.New("No MX records found")
	}
	ch := make(chan interface{}, 1)
	selectedMXCh := make(chan *net.MX, 1)

	var done bool
	var mutex sync.Mutex

	for i, r := range mxRecords {
		addr := r.Host + smtpPort
		index := i
		go func() {
			c, err := dialSMTP(addr, proxyURI, localAddr, connectTimeout, operationTimeout)
			if err != nil {
				if !done {
					ch <- err
				}
				return
			}

			mutex.Lock()
			switch {
			case !done:
				done = true
				ch <- c
				selectedMXCh <- mxRecords[index]
			default:
				c.Close()
			}
			mutex.Unlock()
		}()
	}

	var errs []error
	for {
		res := <-ch
		switch r := res.(type) {
		case *smtp.Client:
			return r, <-selectedMXCh, nil
		case error:
			errs = append(errs, r)
			if len(errs) == len(mxRecords) {
				return nil, nil, errs[0]
			}
		default:
			return nil, nil, errors.New("Unexpected response dialing SMTP server")
		}
	}

}

func dialSMTP(addr, proxyURI, localAddr string, connectTimeout, operationTimeout time.Duration) (*smtp.Client, error) {
	var conn net.Conn
	var err error

	if proxyURI != "" {
		conn, err = establishProxyConnection(addr, proxyURI, connectTimeout)
	} else {
		conn, err = establishConnection(addr, localAddr, connectTimeout)
	}
	if err != nil {
		return nil, err
	}

	err = conn.SetDeadline(time.Now().Add(operationTimeout))
	if err != nil {
		return nil, err
	}

	host, _, _ := net.SplitHostPort(addr)
	return smtp.NewClient(conn, host)
}

func GenerateSmartRandomEmails(domain string, count int) []string {
	prefixes := []string{"verify.test.", "check.mail.", "nonexistent.", "test.user.", "audit.99."}
	emails := make([]string, 0, count)

	for i := 0; i < count; i++ {
		prefix := prefixes[rand.Intn(len(prefixes))]
		suffix := fmt.Sprintf("%d", rand.Intn(10000))
		emails = append(emails, fmt.Sprintf("%s%s@%s", prefix, suffix, domain))
	}
	return emails
}

func establishConnection(addr, localAddr string, timeout time.Duration) (net.Conn, error) {
	d := net.Dialer{Timeout: timeout}
	if localAddr != "" {
		lAddr, err := net.ResolveTCPAddr("tcp", localAddr+":0")
		if err == nil {
			d.LocalAddr = lAddr
		}
	}
	return d.Dial("tcp", addr)
}

func establishProxyConnection(addr, proxyURI string, timeout time.Duration) (net.Conn, error) {
	u, err := url.Parse(proxyURI)
	if err != nil {
		return nil, err
	}
	dialer, err := proxy.FromURL(u, nil)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	return dialer.(proxy.ContextDialer).DialContext(ctx, "tcp", addr)
}
