package main

import (
	"io/ioutil"
	"log"
	"sync"
	"sync/atomic"
	"time"
)

func runStress() {
	info, err := ioutil.ReadDir("../data/whoTook")

	if err != nil {
		panic(err)
	}

	games := []Game{}

	// ---------------------------

	startIO := time.Now()

	for _, file := range info {
		game := readGame("../data/whoTook/" + file.Name())
		games = append(games, game)
	}

	elapsedIO := time.Since(startIO)
	log.Printf("IO %s", elapsedIO)

	// ---------------------------

	startSequential := time.Now()

	for _, game := range games {
		simulateGame(game)
	}

	elapsedSequential := time.Since(startSequential)
	log.Printf("Sequential %s", elapsedSequential)

	// ---------------------------

	startParallel := time.Now()

	var ops uint64
	var wg sync.WaitGroup

	for _, game := range games {
		wg.Add(1)
		go func(game Game) {
			defer wg.Done()
			simulateGame(game)
			atomic.AddUint64(&ops, 1)
		}(game)
	}

	wg.Wait()

	elapsedParallel := time.Since(startParallel)
	log.Printf("Parallel %v ops %s", ops, elapsedParallel)
}
