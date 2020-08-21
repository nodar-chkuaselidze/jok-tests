package main

// CardColor |
type CardColor int

const (
	// Hearts |
	Hearts CardColor = 0

	// Diamonds |
	Diamonds CardColor = 1

	// Spades |
	Spades CardColor = 2

	// Clubs |
	Clubs CardColor = 3

	// None | only used during "9"-s
	None CardColor = 4

	// Null | joker wants to take it
	Null CardColor = 5
)

// CardLevel |
type CardLevel int

const (
	// _6 |
	_6 CardLevel = 0

	// _7 |
	_7 CardLevel = 1

	// _8 |
	_8 CardLevel = 2

	// _9 |
	_9 CardLevel = 3

	// _10 |
	_10 CardLevel = 4

	// Jack |
	Jack CardLevel = 5

	// Queen |
	Queen CardLevel = 6

	// King |
	King CardLevel = 7

	// Ace |
	Ace CardLevel = 8
)

// Card |
type Card struct {
	Color CardColor `json:"color"`
	Level CardLevel `json:"level"`
}

// DownCard |
type DownCard struct {
	Color          CardColor       `json:"color"`
	Level          CardLevel       `json:"level"`
	JokerSubAction *JokerSubAction `json:"jokerSubAction"`
}

// JokerSubAction |
type JokerSubAction struct {
	/**
	 * Determines if joker Want to take it or not
	 */
	Want bool `json:"want"`

	/**
	 * if (playerIndex === 0)
	 *   Color is required
	 * else
	 *   Color must be null
	 */
	Color *CardColor `json:"color"`
}

// Any |
type Any interface{}

// GameEntry |
type GameEntry struct {
	Section               int       `json:"section"`
	Round                 int       `json:"round"`
	Step                  int       `json:"step"`
	DownCards             []Any     `json:"downCards"`
	TrumpColor            CardColor `json:"trumpColor"`
	StepFirstPlayerIndex  int       `json:"stepFirstPlayerIndex"`
	StepWinnerPlayerIndex int       `json:"stepWinnerPlayerIndex"`
}

// Game |
type Game []GameEntry
