package emailverifier

import (
	"fmt"
	"strconv"
	"strings"
)

const (
	ErrTimeout           = "The connection to the mail server has timed out"
	ErrNoSuchHost        = "Mail server does not exist"
	ErrServerUnavailable = "Mail server is unavailable"
	ErrBlocked           = "Blocked by mail server"
	ErrTryAgainLater           = "Try again later"
	ErrFullInbox               = "Recipient out of disk space"
	ErrTooManyRCPT             = "Too many recipients"
	ErrNoRelay                 = "Not an open relay"
	ErrMailboxBusy             = "Mailbox busy"
	ErrExceededMessagingLimits = "Messaging limits have been exceeded"
	ErrNotAllowed              = "Not Allowed"
	ErrNeedMAILBeforeRCPT      = "Need MAIL before RCPT"
	ErrRCPTHasMoved            = "Recipient has moved"
)
type LookupError struct {
	Message string `json:"message" xml:"message"`
	Details string `json:"details" xml:"details"`
}
func newLookupError(message, details string) *LookupError {
	return &LookupError{message, details}
}

func (e *LookupError) Error() string {
	return fmt.Sprintf("%s : %s", e.Message, e.Details)
}
func ParseSMTPError(err error) *LookupError {
	errStr := err.Error()
	if len(errStr) < 3 {
		return parseBasicErr(err)
	}
	status, convErr := strconv.Atoi(string([]rune(errStr)[0:3]))
	if convErr != nil {
		return parseBasicErr(err)
	}
	if status > 400 {
		if insContains(errStr,
			"undeliverable",
			"does not exist",
			"may not exist",
			"user unknown",
			"user not found",
			"invalid address",
			"recipient invalid",
			"recipient rejected",
			"address rejected",
			"no mailbox") {
			return newLookupError(ErrServerUnavailable, errStr)
		}

		switch status {
		case 421:
			return newLookupError(ErrTryAgainLater, errStr)
		case 450:
			return newLookupError(ErrMailboxBusy, errStr)
		case 451:
			return newLookupError(ErrExceededMessagingLimits, errStr)
		case 452:
			if insContains(errStr,
				"full",
				"space",
				"over quota",
				"insufficient",
			) {
				return newLookupError(ErrFullInbox, errStr)
			}
			return newLookupError(ErrTooManyRCPT, errStr)
		case 503:
			return newLookupError(ErrNeedMAILBeforeRCPT, errStr)
		case 550:
			if insContains(errStr,
				"spamhaus",
				"proofpoint",
				"cloudmark",
				"banned",
				"blacklisted",
				"blocked",
				"block list",
				"denied") {
				return newLookupError(ErrBlocked, errStr)
			}
			return newLookupError(ErrServerUnavailable, errStr)
		case 551:
			return newLookupError(ErrRCPTHasMoved, errStr)
		case 552:
			return newLookupError(ErrFullInbox, errStr)
		case 553:
			return newLookupError(ErrNoRelay, errStr)
		case 554:
			return newLookupError(ErrNotAllowed, errStr)
		default:
			return parseBasicErr(err)
		}
	}
	return nil
}
func parseBasicErr(err error) *LookupError {
	errStr := err.Error()
	switch {
	case insContains(errStr,
		"spamhaus",
		"proofpoint",
		"cloudmark",
		"banned",
		"blocked",
		"denied"):
		return newLookupError(ErrBlocked, errStr)
	case insContains(errStr, "timeout"):
		return newLookupError(ErrTimeout, errStr)
	case insContains(errStr, "no such host"):
		return newLookupError(ErrNoSuchHost, errStr)
	case insContains(errStr, "unavailable"):
		return newLookupError(ErrServerUnavailable, errStr)
	default:
		return newLookupError(errStr, errStr)
	}
}
func insContains(str string, subStrs ...string) bool {
	for _, subStr := range subStrs {
		if strings.Contains(strings.ToLower(str),
			strings.ToLower(subStr)) {
			return true
		}
	}
	return false
}
