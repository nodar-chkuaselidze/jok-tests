package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

func readGame(fileName string) Game {
	jsonFile, err := os.Open(fileName)
	defer jsonFile.Close()

	if err != nil {
		panic(err)
	}

	var game Game

	byteValue, _ := ioutil.ReadAll(jsonFile)
	err2 := json.Unmarshal(byteValue, &game)

	if err2 != nil {
		panic(err2)
	}

	return game
}
