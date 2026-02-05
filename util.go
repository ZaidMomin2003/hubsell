package emailverifier

import (
	"crypto/md5"
	"encoding/hex"
	"reflect"
	"strings"

	"golang.org/x/net/idna"
)

func splitDomain(domain string) (string, string) {
	parts := strings.Split(domain, ".")
	n := len(parts)
	if len(parts) >= 2 {
		return parts[n-2], parts[n-1]
	}
	return "", parts[0]
}

func domainToASCII(domain string) string {
	asciiDomain, err := idna.ToASCII(domain)
	if err != nil {
		return domain
	}
	return asciiDomain

}

func callJobFuncWithParams(jobFunc interface{}, params []interface{}) []reflect.Value {
	typ := reflect.TypeOf(jobFunc)
	if typ.Kind() != reflect.Func {
		return nil
	}
	f := reflect.ValueOf(jobFunc)
	if len(params) != f.Type().NumIn() {
		return nil
	}
	in := make([]reflect.Value, len(params))
	for k, param := range params {
		in[k] = reflect.ValueOf(param)
	}
	return f.Call(in)
}

func getMD5Hash(str string) (error, string) {
	h := md5.New()
	_, err := h.Write([]byte(str))
	if err != nil {
		return err, ""
	}
	return nil, hex.EncodeToString(h.Sum(nil))
}
