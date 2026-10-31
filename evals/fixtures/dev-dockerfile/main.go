package main

import (
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("status ok")) })
	http.ListenAndServe(":"+os.Getenv("PORT"), nil)
}
