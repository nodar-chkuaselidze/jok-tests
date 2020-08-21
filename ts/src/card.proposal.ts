/**
 * format:
 *  [JokerColor:3bits][JokerWants:1bit][CardLevel:4bits][CardColor:3bits]
 */

// 0. internal constants
const CARD_COLOR_BITLEN = 3;
const CARD_COLOR_BITMASK = 0x7;

const CARD_LEVEL_BITLEN = 4;
const CARD_LEVEL_BITMASK = 0xf;

const CARD_BITLEN = CARD_COLOR_BITLEN + CARD_LEVEL_BITLEN;

const JOKER_CARD_ACTION_BITLEN = 1;
const JOKER_CARD_ACTION_BITMASK = 0x1;

// 1. types

export enum CardLevel {
  _6 = 1,
  _7 = 2,
  _8 = 3,
  _9 = 4,
  _10 = 5,
  Jack = 6,
  Queen = 7,
  King = 8,
  Ace = 9,
}

export enum CardColor {
  None = 0,

  Hearts = 1,
  Diamonds = 2,
  Spades = 3,
  Clubs = 4,
}

export enum CardJokerAction {
  Want = 1,
  DontWant = 0,
}

export type Card = number & { readonly __tag: unique symbol };
export type PlayedCard = number & {
  readonly __tag: unique symbol;
};

// 2. api functions
export function createCard(color: CardColor, level: CardLevel): Card {
  // prettier-ignore
  return <Card>(
    level << CARD_COLOR_BITLEN | color
  )
}

export function createPlayedCard(
  color: CardColor,
  level: CardLevel,
  jokerAction: CardJokerAction = 0,
  jokerColor: CardColor = 0,
): PlayedCard {
  // NOTE(ez): აქ შეიძლება ოპტიმიზაცია რომ არ გაკეთდეს საერთოდ ბიტური ოპერაციები
  // ჯოკერის action & color-სთვის თუ 0-ებია, თუმცა არ ვიცი რამდენად ღირს,
  // მემგონი უმნიშვნელო იქნება

  const card = createCard(color, level);

  // prettier-ignore
  return <PlayedCard>(
    (jokerColor << JOKER_CARD_ACTION_BITLEN | jokerAction) << CARD_BITLEN | card
  );
}

export function getCardColor(card: Card | PlayedCard): CardColor {
  // prettier-ignore
  return card & CARD_COLOR_BITMASK;
}

export function getCardLevel(card: Card | PlayedCard): CardLevel {
  // prettier-ignore
  return (card >> CARD_COLOR_BITLEN) & CARD_LEVEL_BITMASK;
}

export function getCardJokerAction(
  card: PlayedCard,
): CardJokerAction {
  // prettier-ignore
  return (card >> CARD_BITLEN) & JOKER_CARD_ACTION_BITMASK;
}

export function getCardJokerColor(card: PlayedCard): CardColor {
  // prettier-ignore
  return (card >> CARD_BITLEN >> JOKER_CARD_ACTION_BITLEN) & CARD_COLOR_BITMASK;
}

export function isJokerCard(card: Card | PlayedCard) {
  if (getCardLevel(card) !== CardLevel._6) {
    return false;
  }

  const cardColor = getCardColor(card);

  return (
    cardColor === CardColor.Spades || cardColor === CardColor.Clubs
  );
}

// 3. usage (via api functions)

// // card
// const card = createCard(CardColor.Hearts, CardLevel.Ace);

// // playedCard
// const playedCard = createPlayedCard(CardColor.Hearts, CardLevel.Ace);

// // played joker wants
// const downCardJokerWants = createPlayedCard(
//   CardColor.Clubs,
//   CardLevel._6,
//   CardJokerAction.Want,
// );

// // played joker wants hearts
// const downCardJokerWantHearts: PlayedCard = createPlayedCard(
//   CardColor.Spades,
//   CardLevel._6,
//   CardJokerAction.Want,
//   CardColor.Hearts,
// );

// // extract specific data
// const cardColor = getCardColor(card);
// const playedCardColor = getCardColor(playedCard);

// const hasJoker = [
//   createCard(CardColor.Diamonds, CardLevel.Jack),
//   createCard(CardColor.Diamonds, CardLevel.Queen),
//   createCard(CardColor.Clubs, CardLevel._6),
//   createCard(CardColor.Spades, CardLevel._8),
// ].some(isJokerCard);
