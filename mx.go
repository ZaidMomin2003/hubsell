package emailverifier

import "net"

type Mx struct {
	HasMXRecord bool
	Records     []*net.MX
}

func (v *Verifier) CheckMX(domain string) (*Mx, error) {
	domain = domainToASCII(domain)
	mx, err := net.LookupMX(domain)
	if err != nil && len(mx) == 0 {
		return nil, err
	}
	return &Mx{
		HasMXRecord: len(mx) > 0,
		Records:     mx,
	}, nil
}
