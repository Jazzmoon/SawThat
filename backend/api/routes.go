package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func homepage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Basic Home Page")
}

func serveFiles(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.Path)
	p := "." + r.URL.Path
	if p == "./" {
		p = "frontend/templates/index.html"
	}
	http.ServeFile(w, r, p)
}

func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", homepage)
	router.HandleFunc("/ws", wsEndpoint)
	log.Fatal(http.ListenAndServe(":10000", router))
}
