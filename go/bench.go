package main

import (
	"log"
	"sync"
	"time"
)

var c = 20
var n = 5000000

var null2 = Null

// Case |
type Case struct {
	Name           string
	Trump          CardColor
	FirstCardIndex int
	Cards          []DownCard
}

var cases = []Case{
	{
		Name:           "all-hearts        ",
		Trump:          Hearts,
		FirstCardIndex: 3,
		Cards: []DownCard{
			{Hearts, _7, nil},
			{Hearts, Ace, nil},
			{Hearts, King, nil},
			{Hearts, Jack, nil},
		},
	},
	{
		Name: "win-trump         ",

		Trump:          Diamonds,
		FirstCardIndex: 1,
		Cards: []DownCard{
			{Hearts, _7, nil},
			{Hearts, Ace, nil},
			{Diamonds, _6, nil},
			{Hearts, Jack, nil},
		},
	},
	{
		Name:           "special-case      ",
		Trump:          None,
		FirstCardIndex: 2,
		Cards: []DownCard{
			{Hearts, _6, nil},
			{Hearts, _8, nil},
			{Hearts, _7, nil},
			{Hearts, _10, nil},
		},
	},
	{
		Name:           "double-joker-wants",
		Trump:          Clubs,
		FirstCardIndex: 3,
		Cards: []DownCard{
			{
				Clubs,
				_6,
				&JokerSubAction{Want: true, Color: &null2},
			},
			{Hearts, _7, nil},
			{
				Spades,
				_6,
				&JokerSubAction{Want: true, Color: &null2},
			},
			{Diamonds, _7, nil},
		},
	},
}

func runBench() {
	for _, entry := range cases {
		start := time.Now()

		for i := 0; i < n; i++ {
			whoTook(entry.Cards, entry.Trump, entry.FirstCardIndex)
		}

		elapsed := time.Since(start)
		log.Printf("[sequential] case: %v ops: %v time: %s", entry.Name, n, elapsed)

	}
}

func runBenchParallel() {
	for _, entry := range cases {
		start := time.Now()
		var wg sync.WaitGroup

		for i := 0; i < c; i++ {
			wg.Add(1)
			go func(entry Case) {
				defer wg.Done()
				for i := 0; i < n/c; i++ {
					whoTook(entry.Cards, entry.Trump, entry.FirstCardIndex)
				}
			}(entry)
		}

		wg.Wait()

		elapsed := time.Since(start)
		log.Printf("  [parallel] case: %v ops: %v time: %s", entry.Name, n, elapsed)

	}
}
