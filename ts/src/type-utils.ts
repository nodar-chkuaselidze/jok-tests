import {
  CARD_COLOR_BITLEN,
  CARD_COLOR_BITMASK,
  CARD_LEVEL_BITLEN,
  CARD_LEVEL_BITMASK,
  CCARD_BITMASK,
  CJOKER_WANT_BITMASK,
  CJOKER_SUB_ACTION_BITLEN,
  CJOKER_SUB_ACTION_BITMASK,

  CardColor,
  CardLevel,
  Card,
  CCard,
  CJokerSubAction,
  DownCard,
  CDownCard
} from './types'

// CCard related functions.
export function getCCardFromCard(card: Card): CCard {
  const ccard = card[0] << CARD_LEVEL_BITLEN | card[1];

  return ccard as CCard;
}

export function getCCardFromColorLevel(color: CardColor, level: CardLevel): CCard {
  const card = color << CARD_LEVEL_BITLEN | level;

  return card as CCard;
}

export function getColorFromCCard(card: CCard): CardColor {
  return card >> CARD_LEVEL_BITLEN & CARD_COLOR_BITMASK;
}

export function getLevelFromCCard(card: CCard): CardLevel {
  return card & CARD_LEVEL_BITMASK;
}

export function getCardFromCCard(card: CCard): Card {
  const color = card >> CARD_LEVEL_BITLEN & CARD_COLOR_BITMASK;
  const level = card & CARD_LEVEL_BITMASK;

  return [color, level];
}

export const CCARD_JOKER_1 = getCCardFromColorLevel(CardColor.Clubs, CardLevel._6);
export const CCARD_JOKER_2 = getCCardFromColorLevel(CardColor.Spades, CardLevel._6);

// CJokerSubAction related functions.
export function getCJokerSubActionFromColor(color: CardColor, want: number): CJokerSubAction {
  const cJokerSubAction = want << CARD_COLOR_BITLEN | color;

  return cJokerSubAction as CJokerSubAction;
}

export function getWantFromCJokerSubAction(cJokSubAction: CJokerSubAction): number {
  return cJokSubAction >> CARD_COLOR_BITLEN & CJOKER_WANT_BITMASK;
}

export function getColorFromCJokerSubAction(cJokSubAction: CJokerSubAction): CardColor {
  return cJokSubAction & CARD_COLOR_BITMASK;
}

// CDownCard related functions.
export function getCDownCardFromCCardJokSubAction(
  ccard: CCard,
  cJokSubAction: CJokerSubAction
): CDownCard {
  const cDownCard = ccard << CJOKER_SUB_ACTION_BITLEN | cJokSubAction;

  return cDownCard as CDownCard;
}

export function getCJokerSubActionFromCDownCard(cDownCard: CDownCard): CJokerSubAction {
  return (cDownCard & CJOKER_SUB_ACTION_BITMASK) as CJokerSubAction;
}

export function getCCardFromCDownCard(cDownCard: CDownCard): CCard {
  return (cDownCard >> CJOKER_SUB_ACTION_BITLEN & CCARD_BITMASK) as CCard;
}

export function getCDownCardFromDownCard(downCard: DownCard): CDownCard {
  const cCard = getCCardFromColorLevel(downCard[0], downCard[1]);
  let cJokSubAction = 0 as CJokerSubAction;

  if (downCard[2]) {
    cJokSubAction = getCJokerSubActionFromColor(downCard[2].color, +downCard[2].want);
  }

  return getCDownCardFromCCardJokSubAction(cCard, cJokSubAction);
}
