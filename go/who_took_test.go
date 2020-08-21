package main

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var null = Null
var hearts = Hearts
var spades = Spades

var _ = Describe("Goker", func() {
	It("should win Ace (in same colors)", func() {
		cards := []DownCard{
			{Hearts, _7, nil},
			{Hearts, Ace, nil},
			{Hearts, King, nil},
			{Hearts, Jack, nil},
		}

		Expect(whoTook(cards, Hearts, 0)).To(Equal(1))
		Expect(whoTook(cards, Hearts, 1)).To(Equal(1))
		Expect(whoTook(cards, Hearts, 2)).To(Equal(1))
		Expect(whoTook(cards, Hearts, 3)).To(Equal(1))
		Expect(whoTook(cards, Clubs, 3)).To(Equal(1))
		Expect(whoTook(cards, Diamonds, 3)).To(Equal(1))
		Expect(whoTook(cards, Spades, 3)).To(Equal(1))
		Expect(whoTook(cards, None, 3)).To(Equal(1))
	})

	It("should win trump", func() {
		cards := []DownCard{
			{Hearts, _7, nil},
			{Hearts, Ace, nil},
			{Diamonds, _6, nil},
			{Hearts, Jack, nil},
		}

		Expect(whoTook(cards, Diamonds, 0)).To(Equal(2))
		Expect(whoTook(cards, Diamonds, 1)).To(Equal(2))
		Expect(whoTook(cards, Diamonds, 2)).To(Equal(2))
		Expect(whoTook(cards, Diamonds, 3)).To(Equal(2))
	})

	It("should win first card (in no color)", func() {
		cards := []DownCard{
			{Clubs, _7, nil},
			{Diamonds, Ace, nil},
			{Hearts, _6, nil},
			{Spades, Jack, nil},
		}

		Expect(whoTook(cards, None, 0)).To(Equal(0))
		Expect(whoTook(cards, None, 1)).To(Equal(1))
		Expect(whoTook(cards, None, 2)).To(Equal(2))
		Expect(whoTook(cards, None, 3)).To(Equal(3))
	})

	It("should handle special case", func() {
		cards := []DownCard{
			{Hearts, _6, nil},
			{Hearts, _8, nil},
			{Hearts, _7, nil},
			{Hearts, _10, nil},
		}

		Expect(whoTook(cards, None, 2)).To(Equal(3))
	})

	It("should handle special case 2", func() {
		cards := []DownCard{
			{Diamonds, _6, nil},
			{Clubs, _7, nil},
			{Clubs, _9, nil},
			{Diamonds, Queen, nil},
		}

		Expect(whoTook(cards, Clubs, 2)).To(Equal(2))
	})

	It("should let joker win", func() {
		cards := []DownCard{
			{Diamonds, Queen, nil},
			{Spades, Queen, nil},
			{Hearts, _6, nil},
			{Spades, King, nil},
		}

		Expect(whoTook(cards, None, 0)).To(Equal(0))
	})

	It("should let second joker win", func() {
		cards := []DownCard{
			{Clubs, _6, &JokerSubAction{true, &null}},
			{Hearts, _7, nil},
			{Spades, _6, &JokerSubAction{true, &null}},
			{Diamonds, _6, nil},
		}

		Expect(whoTook(cards, Clubs, 3)).To(Equal(2))
	})

	It("should give somebody else if joker does not want it", func() {
		cards := []DownCard{
			{Diamonds, _10, nil},
			{Clubs, _6, &JokerSubAction{false, &hearts}},
			{Hearts, King, nil},
			{Spades, _8, nil},
		}

		Expect(whoTook(cards, None, 1)).To(Equal(2))
	})

	It("should give somebody else if neither want it", func() {
		cards := []DownCard{
			{Clubs, _9, nil},
			{Clubs, _6, &JokerSubAction{false, &hearts}},
			{Spades, _6, &JokerSubAction{false, &hearts}},
			{Hearts, _6, nil},
		}

		Expect(whoTook(cards, None, 2)).To(Equal(3))
	})

	It("should handle case when joker does not want trump", func() {
		cards := []DownCard{
			{Diamonds, _10, nil},
			{Spades, _6, &JokerSubAction{true, &hearts}},
			{Hearts, King, nil},
			{Spades, _8, nil},
		}

		Expect(whoTook(cards, Diamonds, 1)).To(Equal(0))
		Expect(whoTook(cards, None, 1)).To(Equal(1))
		Expect(whoTook(cards, Clubs, 1)).To(Equal(1))
	})

	It("should let joker take it even if he does not want it", func() {
		cards := []DownCard{
			{Diamonds, _10, nil},
			{Spades, _6, &JokerSubAction{false, &hearts}},
			{Spades, King, nil},
			{Spades, _8, nil},
		}

		Expect(whoTook(cards, None, 1)).To(Equal(1))
		Expect(whoTook(cards, Clubs, 1)).To(Equal(1))
		Expect(whoTook(cards, Diamonds, 1)).To(Equal(0))
	})

	It("should let somebody else take if if joker don't want it", func() {
		cards := []DownCard{
			{Diamonds, _10, nil},
			{Spades, _6, &JokerSubAction{false, &hearts}},
			{Spades, King, nil},
			{Spades, _8, nil},
		}

		Expect(whoTook(cards, Diamonds, 1)).To(Equal(0))
		Expect(whoTook(cards, Spades, 1)).To(Equal(2))
	})

	It("should handle when joker does not want and trump card takes it", func() {
		cards := []DownCard{

			{Diamonds, _10, nil},
			{Spades, _6, &JokerSubAction{false, &spades}},
			{Clubs, King, nil},
			{Spades, _8, nil},
		}

		Expect(whoTook(cards, Clubs, 1)).To(Equal(2))
	})
})
