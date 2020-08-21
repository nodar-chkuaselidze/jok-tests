import {
  CardColor,
  CardJokerAction,
  getCardColor,
  getCardJokerAction,
  getCardJokerColor,
  getCardLevel,
  isJokerCard,
  PlayedCard,
} from './card.proposal';
import {
  getNatarebiColor,
  maxNumber,
} from './utils-proposal';

export function whoTook7(
  cards: PlayedCard[],
  trumpColor: CardColor,
  firstCardIndex: number,
) {

  const firstDownCard = cards[firstCardIndex];
  const firstCardColor = getNatarebiColor(firstDownCard);

  const isFirstCardJoker = isJokerCard(firstDownCard);

  let cJokWant: CardJokerAction | null = null;
  let cJokSubActionColor: CardColor | null = null;

  if (isFirstCardJoker) {
    cJokWant = getCardJokerAction(firstDownCard);
    cJokSubActionColor = getCardJokerColor(firstDownCard);
  }

  // როცა ჯოკერმა აცხადა რომ სურს კოზირისგან განსხვავებული ფერი.
  const jokerWantsNonTrump =
    isFirstCardJoker && cJokSubActionColor !== trumpColor;

  const jokerDontWantColor =
    isFirstCardJoker && !cJokWant ? cJokSubActionColor : null;

  const cardValues = new Array<number>(4);

  for (let i = 0; i < cards.length; i++) {
    const playedCard = cards[i];
    const isFirstCard = i === firstCardIndex;

    const color = getCardColor(playedCard);
    const level = getCardLevel(playedCard);
    const isJoker = isJokerCard(playedCard);

    let cJokerWant = null;

    if (isJoker) {
      cJokerWant = getCardJokerAction(playedCard);
      if (cJokerWant) {
        let priority = 100;

        if (isFirstCard && jokerWantsNonTrump) {
          priority = 20;
        }

        cardValues[i] = priority + (((i - firstCardIndex) % 4) & 3);
        continue;
      }

      if (isFirstCard) {
        cardValues[i] = 1;
        continue;
      }

      cardValues[i] = 0;
      continue;
    }

    // არა ჯოკერი.
    const isTrumpColor = color === trumpColor;
    const isFirstCardColor = color === firstCardColor;

    if (!isFirstCard && !isFirstCardColor && !isTrumpColor) {
      cardValues[i] = 0;
      continue;
    }

    const isJokerDontWantColor = color === jokerDontWantColor;

    let priority = level + 1;

    if (isTrumpColor) priority += 50;

    if (isJokerDontWantColor) priority += 20;

    cardValues[i] = priority;
  }

  const max = maxNumber(cardValues);

  return cardValues.indexOf(max);
}
