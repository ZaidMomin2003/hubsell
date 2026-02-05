package emailverifier

import (
	"context"
	"io"
	"net/http"
	"strings"
	"time"
)
type Gravatar struct {
	HasGravatar bool   `json:"has_gravatar"`
	GravatarUrl string `json:"gravatar_url"`
}
func (v *Verifier) CheckGravatar(email string) (*Gravatar, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err, emailMd5 := getMD5Hash(strings.ToLower(strings.TrimSpace(email)))
	if err != nil {
		return nil, err
	}
	gravatarUrl := gravatarBaseUrl + emailMd5 + "?d=404"
	req, err := http.NewRequest("GET", gravatarUrl, nil)
	if err != nil {
		return nil, err
	}
	resp, err := http.DefaultClient.Do(req.WithContext(ctx))
	if err != nil {
		return nil, err
	}

	defer func() {
		_ = resp.Body.Close()
	}()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	err, md5Body := getMD5Hash(string(body))
	if err != nil {
		return nil, err
	}
	if md5Body == gravatarDefaultMd5 || resp.StatusCode != 200 {
		return &Gravatar{
			HasGravatar: false,
			GravatarUrl: "",
		}, nil
	}
	return &Gravatar{
		HasGravatar: true,
		GravatarUrl: gravatarUrl,
	}, nil
}
