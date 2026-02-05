package emailverifier

import (
	"fmt"
	"net/http"
	"time"
)

type Verifier struct {
	smtpCheckEnabled     bool
	catchAllCheckEnabled bool
	domainSuggestEnabled bool
	gravatarCheckEnabled bool
	fromEmail            string
	helloName            string
	schedule             *schedule
	proxyURI             string
	apiVerifiers         map[string]smtpAPIVerifier

	connectTimeout   time.Duration
	operationTimeout time.Duration
	localAddr        string
}

type Result struct {
	Email        string    `json:"email"`
	Reachable    string    `json:"reachable"`
	Syntax       Syntax    `json:"syntax"`
	SMTP         *SMTP     `json:"smtp"`
	Gravatar     *Gravatar `json:"gravatar"`
	Suggestion   string    `json:"suggestion"`
	Disposable   bool      `json:"disposable"`
	RoleAccount  bool      `json:"role_account"`
	Free         bool      `json:"free"`
	HasMxRecords bool      `json:"has_mx_records"`
}

var additionalDisposableDomains map[string]bool = map[string]bool{}

func init() {
	for d := range disposableDomains {
		disposableSyncDomains.Store(d, struct{}{})
	}
}

func NewVerifier() *Verifier {
	return &Verifier{
		fromEmail:            defaultFromEmail,
		helloName:            defaultHelloName,
		catchAllCheckEnabled: true,
		apiVerifiers:         map[string]smtpAPIVerifier{},
		connectTimeout:       10 * time.Second,
		operationTimeout:     10 * time.Second,
	}
}

func (v *Verifier) Verify(email string) (*Result, error) {

	ret := Result{
		Email:     email,
		Reachable: reachableUnknown,
	}

	syntax := v.ParseAddress(email)
	ret.Syntax = syntax
	if !syntax.Valid {
		return &ret, nil
	}

	ret.Free = v.IsFreeDomain(syntax.Domain)
	ret.RoleAccount = v.IsRoleAccount(syntax.Username)
	ret.Disposable = v.IsDisposable(syntax.Domain)
	if v.domainSuggestEnabled {
		ret.Suggestion = v.SuggestDomain(syntax.Domain)
	}

	if ret.Disposable {
		return &ret, nil
	}

	mx, err := v.CheckMX(syntax.Domain)
	if err != nil {
		errStr := err.Error()
		if insContains(errStr, "no such host") {
			ret.Reachable = reachableNo
			return &ret, newLookupError(ErrNoSuchHost, errStr)
		}
		return &ret, err
	}
	ret.HasMxRecords = mx.HasMXRecord

	smtp, err := v.CheckSMTP(syntax.Domain, syntax.Username)
	if err != nil {
		return &ret, err
	}
	ret.SMTP = smtp
	ret.Reachable = v.calculateReachable(smtp)

	if v.gravatarCheckEnabled {
		gravatar, err := v.CheckGravatar(email)
		if err != nil {
			return &ret, err
		}
		ret.Gravatar = gravatar
	}

	return &ret, nil
}

func (v *Verifier) AddDisposableDomains(domains []string) *Verifier {
	for _, d := range domains {
		additionalDisposableDomains[d] = true
		disposableSyncDomains.Store(d, struct{}{})
	}
	return v
}

func (v *Verifier) EnableGravatarCheck() *Verifier {
	v.gravatarCheckEnabled = true
	return v
}

func (v *Verifier) DisableGravatarCheck() *Verifier {
	v.gravatarCheckEnabled = false
	return v
}

func (v *Verifier) EnableSMTPCheck() *Verifier {
	v.smtpCheckEnabled = true
	return v
}

func (v *Verifier) EnableAPIVerifier(name string) error {
	switch name {
	case YAHOO:
		v.apiVerifiers[YAHOO] = newYahooAPIVerifier(http.DefaultClient)
	default:
		return fmt.Errorf("unsupported to enable the API verifier for vendor: %s", name)
	}
	return nil
}

func (v *Verifier) DisableAPIVerifier(name string) {
	delete(v.apiVerifiers, name)
}

func (v *Verifier) DisableSMTPCheck() *Verifier {
	v.smtpCheckEnabled = false
	return v
}

func (v *Verifier) EnableCatchAllCheck() *Verifier {
	v.catchAllCheckEnabled = true
	return v
}

func (v *Verifier) DisableCatchAllCheck() *Verifier {
	v.catchAllCheckEnabled = false
	return v
}

func (v *Verifier) EnableDomainSuggest() *Verifier {
	v.domainSuggestEnabled = true
	return v
}

func (v *Verifier) DisableDomainSuggest() *Verifier {
	v.domainSuggestEnabled = false
	return v
}

func (v *Verifier) EnableAutoUpdateDisposable() *Verifier {
	v.stopCurrentSchedule()
	_ = updateDisposableDomains(disposableDataURL)
	v.schedule = newSchedule(24*time.Hour, updateDisposableDomains, disposableDataURL)
	v.schedule.start()
	return v
}

func (v *Verifier) DisableAutoUpdateDisposable() *Verifier {
	v.stopCurrentSchedule()
	return v

}

func (v *Verifier) FromEmail(email string) *Verifier {
	v.fromEmail = email
	return v
}

func (v *Verifier) HelloName(domain string) *Verifier {
	v.helloName = domain
	return v
}

func (v *Verifier) Proxy(proxyURI string) *Verifier {
	v.proxyURI = proxyURI
	return v
}

func (v *Verifier) ConnectTimeout(timeout time.Duration) *Verifier {
	v.connectTimeout = timeout
	return v
}

func (v *Verifier) OperationTimeout(timeout time.Duration) *Verifier {
	v.operationTimeout = timeout
	return v
}

func (v *Verifier) LocalAddr(addr string) *Verifier {
	v.localAddr = addr
	return v
}

func (v *Verifier) calculateReachable(s *SMTP) string {
	if !v.smtpCheckEnabled {
		return reachableUnknown
	}
	if s.Deliverable {
		return reachableYes
	}
	if s.CatchAll {
		return reachableUnknown
	}
	return reachableNo
}

func (v *Verifier) stopCurrentSchedule() {
	if v.schedule != nil {
		v.schedule.stop()
	}
}
