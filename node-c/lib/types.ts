export type Card = [CardColor, CardLevel]
export type DownCard = [CardColor, CardLevel, JokerSubAction?]

export const enum CardColor {
  Hearts = 0,
  Diamonds = 1,
  Spades = 2,
  Clubs = 3,
  None = 4,
  Null = 5,
}

export const enum CardLevel {
  _6 = 0,
  _7 = 1,
  _8 = 2,
  _9 = 3,
  _10 = 4,
  Jack = 5,
  Queen = 6,
  King = 7,
  Ace = 8,
}

export type JokerSubAction = {
  want: boolean
  color: CardColor | null
}

// Bit representation: color(3 bits) + level(4 bits)
// total of 7 bits.
export type CCard = number & { __compressed_card__: void };

// Bit representation: want(1 bit) + color(3 bits)
// total 5 bits.
export type CJokerSubAction = number & { __joker_sub_action__: void };

// Bit representation: CCard(7 bits) + CJokerSubAction(5 bits)
// total 12 bits.
export type CDownCard = number & { __down_card__: void };

export const CARD_COLOR_BITLEN = 3;
export const CARD_COLOR_BITMASK = 0x7;

export const CARD_LEVEL_BITLEN = 4;
export const CARD_LEVEL_BITMASK = 0xF;

export const CCARD_BITLEN = 7;
export const CCARD_BITMASK = 0x7f;

export const CJOKER_SUB_ACTION_BITLEN = 4;
export const CJOKER_SUB_ACTION_BITMASK = 0xF;

export const CJOKER_WANT_BITLEN = 1;
export const CJOKER_WANT_BITMASK = 0x1;

export const CDOWN_CARD_BITLEN = 12;
export const CDOWN_CARD_BITMASK = 0xFFF;
