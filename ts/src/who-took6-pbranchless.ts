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
  rotateArray,
} from './utils-proposal';

export function whoTook6BL(
  cards: PlayedCard[],
  trumpColor: CardColor,
  firstCardIndex: number,
) {
  const jokerValues = rotateArray([0, 1, 2, 3], firstCardIndex);

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

  const priorityValues = new Array<number>(4);

  for (let i = 0; i < cards.length; i++) {
    const playedCard = cards[i];
    const isFirstCard = i === firstCardIndex;

    const color = getCardColor(playedCard);
    const level = getCardLevel(playedCard);
    const isJoker = isJokerCard(playedCard);

    let cJokerWant = null;

    if (isJoker) {
      cJokerWant = getCardJokerAction(playedCard);
    }

    let priority = 0;

    priority += (100 + jokerValues[i]) * <any>(isJoker && cJokerWant && !(isFirstCard && jokerWantsNonTrump));
    priority += (20 + jokerValues[i]) * <any>(isJoker && cJokerWant && isFirstCard && jokerWantsNonTrump);
    priority += 1 * <any>(isJoker && !cJokerWant && isFirstCard)

    // არა ჯოკერი.
    const isTrumpColor = color === trumpColor;
    const isFirstCardColor = color === firstCardColor;
    const isJokerDontWantColor = color === jokerDontWantColor;

    priority += (level + 1) * <any>(!isJoker && !(!isFirstCard && !isFirstCardColor && !isTrumpColor));
    priority += 50 * <any>(!isJoker && isTrumpColor);
    priority += 20 * <any>(!isJoker && isFirstCardColor && isJokerDontWantColor);

    priorityValues[i] = priority;
  }

  const max = maxNumber(priorityValues);

  return priorityValues.indexOf(max);
}
