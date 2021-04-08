package main

import (
	"fmt"

	"github.com/AstroCoding/SawThatGoLang/backend/api"
)

func main() {
	fmt.Println("Starting HTTP Server")
	api.StartAPI()
}
