package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func setupRoutes() {
	http.HandleFunc("/", homepage)
	http.HandleFunc("/ws", wsEndpoint)
}

func homepage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Basic Home Page")
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Websocket Endpoint")
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Client Successfully Connected to Websocket.")

	reader(ws)
}

func reader(conn *websocket.Conn) {
	for {
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			log.Fatal(err)
			return
		}
		log.Println(string(msg))
		if err := conn.WriteMessage(msgType, msg); err != nil {
			log.Fatal(err)
			return
		}
	}
}

func startSocket() {
	fmt.Println("Starting HTTP Server")
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8080", nil))
}
