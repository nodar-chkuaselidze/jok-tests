import { CardColor, CDownCard } from './types'
import {
  rotateArray,
  getCNatarebiColor,
  maxNumber,
  isJokerCCard,
} from './utils'

import {
  getColorFromCCard,
  getLevelFromCCard,
  getCCardFromCDownCard,
  getCJokerSubActionFromCDownCard,
  getWantFromCJokerSubAction,
  getColorFromCJokerSubAction,
} from './type-utils'

export function whoTook5(
  cards: CDownCard[],
  trumpColor: CardColor,
  firstCardIndex: number,
) {
  const jokerValues = rotateArray([0, 1, 2, 3], firstCardIndex);

  const firstDownCard = cards[firstCardIndex];
  const firstCardColor = getCNatarebiColor(firstDownCard);

  const firstCCard = getCCardFromCDownCard(firstDownCard);
  const isFirstCardJoker = isJokerCCard(firstCCard);
  let cJokSubAction = null;
  let cJokSubActionColor = null;
  let cJokWant = null;

  if (isFirstCardJoker) {
    cJokSubAction = getCJokerSubActionFromCDownCard(firstDownCard);
    cJokWant = getWantFromCJokerSubAction(cJokSubAction);
    cJokSubActionColor = getColorFromCJokerSubAction(cJokSubAction);
  }

  // roca jokerma acxada rom surs kozirisgan gansxvavebuli peri.
  const jokerWantsNonTrump =
    isFirstCardJoker && cJokSubActionColor !== trumpColor;
  const jokerDontWantColor =
    isFirstCardJoker && !cJokWant ? cJokSubActionColor : null;

  const cardValues = new Array<number>(4);

  for (let i = 0; i < cards.length; i++) {
    const cDownCard = cards[i];
    const isFirstCard = i === firstCardIndex;
    const ccard = getCCardFromCDownCard(cDownCard);
    const color = getColorFromCCard(ccard);
    const level = getLevelFromCCard(ccard);
    const isJoker = isJokerCCard(ccard);

    let cJokerAction = null;
    let cJokerWant = null;

    if (isJoker) {
      cJokerAction = getCJokerSubActionFromCDownCard(cDownCard);
      cJokerWant = getWantFromCJokerSubAction(cJokerAction);
    }

    if (isJoker) {
      if (cJokerWant) {
        let priority = 100;

        if (isFirstCard && jokerWantsNonTrump)
          priority = 20;

        cardValues[i] = priority + jokerValues[i];
        continue;
      }

      if (isFirstCard) {
        cardValues[i] = 1;
        continue;
      }

      cardValues[i] = 0;
      continue;
    }

    // ara jokeri.
    const isTrumpColor = color === trumpColor;
    const isFirstCardColor = color === firstCardColor;

    if (!isFirstCard && !isFirstCardColor && !isTrumpColor) {
      cardValues[i] = 0;
      continue;
    }

    const isJokerDontWantColor = color === jokerDontWantColor;

    let priority = level + 1;

    if (isTrumpColor)
      priority += 50;

    if (isJokerDontWantColor)
      priority += 20;

    cardValues[i] = priority;
  };

  const max = maxNumber(cardValues)

  return cardValues.indexOf(max)
}
