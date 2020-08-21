package main

func whoTook(
	cards []DownCard,
	trumpColor CardColor,
	firstCardIndex int,
) int {
	jokerValues := rotateArray([]int{0, 1, 2, 3}, firstCardIndex)

	firstCard := cards[firstCardIndex]
	firstCardColor := getNatarebiColor(firstCard)

	jokerWantsNonTrump := false
	var jokerDoesNotWantColor *CardColor

	if action := firstCard.JokerSubAction; action != nil {
		if action.Want && *action.Color != trumpColor {
			jokerWantsNonTrump = true
		}

		if !action.Want {
			jokerDoesNotWantColor = action.Color
		}
	}

	cardValues := []int{}

	for i, card := range cards {
		color := card.Color
		level := card.Level
		jokerAction := card.JokerSubAction
		isFirstCard := i == firstCardIndex

		if jokerAction != nil {
			if jokerAction.Want {
				priority := 100

				if isFirstCard && jokerWantsNonTrump {
					priority = 20
				}

				cardValues = append(cardValues, priority+jokerValues[i])
				continue
			}

			if isFirstCard {
				cardValues = append(cardValues, 1)
				continue
			}

			cardValues = append(cardValues, 0)
			continue
		}

		// no joker

		isTrumpColor := color == trumpColor
		isFirstCardColor := color == firstCardColor

		if !isFirstCard && !isFirstCardColor && !isTrumpColor {
			cardValues = append(cardValues, 0)
			continue
		}

		isJokerDoesNotWantColor := false

		if jokerDoesNotWantColor != nil && color == *jokerDoesNotWantColor {
			isJokerDoesNotWantColor = true
		}

		priority := level + 1

		if isTrumpColor {
			priority += 50
		}

		if isJokerDoesNotWantColor {
			priority += 20
		}

		cardValues = append(cardValues, int(priority))
	}

	return indexOf(cardValues, max(cardValues))
}
