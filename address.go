package emailverifier

import (
	"regexp"
	"strings"
)

var emailRegex = regexp.MustCompile(emailRegexString)

type Syntax struct {
	Username string `json:"username"`
	Domain   string `json:"domain"`
	Valid    bool   `json:"valid"`
}

func (v *Verifier) ParseAddress(email string) Syntax {

	isAddressValid := IsAddressValid(email)
	if !isAddressValid {
		return Syntax{Valid: false}
	}

	index := strings.LastIndex(email, "@")
	username := email[:index]
	domain := strings.ToLower(email[index+1:])

	return Syntax{
		Username: username,
		Domain:   domain,
		Valid:    isAddressValid,
	}
}

func IsAddressValid(email string) bool {
	return emailRegex.MatchString(email)
}
