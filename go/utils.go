package main

import (
	"math"
)

func getNatarebiColor(firstCard DownCard) CardColor {
	if action := firstCard.JokerSubAction; action != nil {
		return *action.Color
	}

	return firstCard.Color
}

func max(xs []int) int {
	acc := math.MinInt64

	for _, x := range xs {
		if x > acc {
			acc = x
		}
	}

	return acc
}

func indexOf(xs []int, value int) int {
	for i, x := range xs {
		if x == value {
			return i
		}
	}

	return -1
}

func rotateArray(xs []int, by int) []int {
	ys := make([]int, len(xs))

	for i, x := range xs {
		ys[(i+by)%len(xs)] = x
	}

	return ys
}

func toDownCard(xs []Any) []DownCard {
	cards := []DownCard{}

	for _, x := range xs {
		ys := x.([]interface{})

		color := CardColor(ys[0].(float64))
		level := CardLevel(ys[1].(float64))

		if ys[2] != nil {
			dict := ys[2].(map[string]interface{})

			want := dict["want"].(bool)

			var jokerColor *CardColor

			if dict["color"] != nil {
				x := CardColor(dict["color"].(float64))
				jokerColor = &x
			}

			card := DownCard{
				Color: color,
				Level: level,
				JokerSubAction: &JokerSubAction{
					Want:  want,
					Color: jokerColor,
				},
			}

			cards = append(cards, card)
		} else {
			card := DownCard{
				Color:          color,
				Level:          level,
				JokerSubAction: nil,
			}

			cards = append(cards, card)
		}

	}

	return cards
}

func simulateGame(game Game) {
	for _, entry := range game {
		winner := whoTook(toDownCard(entry.DownCards), entry.TrumpColor, entry.StepFirstPlayerIndex)

		if entry.StepWinnerPlayerIndex != winner {
			panic("something went wrong")
		}
	}
}
