package api

import (
	"net/http"
	"time"

	"github.com/Jazzmoon/SawThat/backend/state"
	"github.com/Jazzmoon/SawThat/backend/util"
)

// health is the response format of "/health".
type health struct {
	Name         string `json:"name"`         // Name of application
	Build        string `json:"build"`        // Build is the Git build hash
	IsDocker     bool   `json:"isDocker"`     // IsDocker indicates if running in Docker
	DatabasePing bool   `json:"databasePing"` // DatabasePing indicates if database is connected
	Time         string `json:"time"`         // Time is the current server time
	Uptime       string `json:"uptime"`       // Uptime is the uptime of the backend
}

// healthHandler is "/health". It returns the health of the backend.
func healthHandler(s *state.State, w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// ping database
	databasePing := true
	err := s.DB.Ping(ctx)
	if err != nil {
		databasePing = false
	}

	// generate response
	now := time.Now().UTC()
	util.Write(w, http.StatusOK, &health{
		Name:         s.Config.Common.AppName,
		Build:        s.Build,
		IsDocker:     s.IsDocker,
		DatabasePing: databasePing,
		Time:         now.Format(time.RFC3339),
		Uptime:       now.Sub(s.Start).String(),
	})
}
