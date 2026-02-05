package emailverifier

import (
	"strings"
	"sync"
)

var (
	disposableSyncDomains sync.Map
)
func (v *Verifier) IsRoleAccount(username string) bool {
	return roleAccounts[strings.ToLower(username)]
}
func (v *Verifier) IsFreeDomain(domain string) bool {
	return freeDomains[domain]
}
func (v *Verifier) IsDisposable(domain string) bool {
	domain = domainToASCII(domain)
	_, found := disposableSyncDomains.Load(domain)
	return found
}
