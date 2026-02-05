package emailverifier

const (
	YAHOO = "yahoo"
)

type smtpAPIVerifier interface {
	isSupported(host string) bool
	check(domain, username string) (*SMTP, error)
}
