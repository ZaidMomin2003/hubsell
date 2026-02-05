package emailverifier

import (
	"time"
)
type schedule struct {
	stopCh    chan struct{}
	jobFunc   interface{}
	jobParams []interface{}
	ticker    *time.Ticker
	running   bool
}
func newSchedule(period time.Duration, jobFunc interface{}, params ...interface{}) *schedule {
	return &schedule{
		stopCh:    make(chan struct{}),
		jobFunc:   jobFunc,
		jobParams: params,
		ticker:    time.NewTicker(period),
	}
}
func (s *schedule) start() {
	if s.running {
		return
	}

	s.running = true
	go func() {
		for {
			select {
			case <-s.ticker.C:
				callJobFuncWithParams(s.jobFunc, s.jobParams)
			case <-s.stopCh:
				s.ticker.Stop()
				return
			}
		}
	}()
}
func (s *schedule) stop() {
	if !s.running {
		return
	}
	s.running = false
	s.stopCh <- struct{}{}
}
