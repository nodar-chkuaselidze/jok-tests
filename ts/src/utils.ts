import {
  CCard,
  CDownCard,
  CardColor,
  DownCard
} from './types'
import {
  CCARD_JOKER_1,
  CCARD_JOKER_2,

  getCCardFromCDownCard,
  getCJokerSubActionFromCDownCard,
  getColorFromCJokerSubAction,
  getColorFromCCard
} from './type-utils';

export function rotateArray<T>(array: T[], by: number): T[] {
  const index = Math.abs(by % array.length)

  switch (by) {
    case 0:
      return array;

    case 1: {
      return [array[3], array[0], array[1], array[2]];
    }

    case 2: {
      return [array[2], array[3], array[0], array[1]];
    }

    case 3: {
      return [array[1], array[2], array[3], array[0]];
    }

    default: {
      if (by > 0) {
        return array
          .slice(array.length - index, array.length)
          .concat(array.slice(0, array.length - index))
      }

      return array
        .slice(index, array.length)
        .concat(array.slice(0, index))
    }
  }
}


export function getNatarebiColor(firstCard: DownCard) {
  return firstCard[2] ? firstCard[2].color : firstCard[0]
}

export function isJokerCCard(cCard: CCard): boolean {
  return cCard === CCARD_JOKER_1 || cCard === CCARD_JOKER_2; 
}

export function isJokerCDownCard(cDownCard: CDownCard): boolean {
  const ccard = getCCardFromCDownCard(cDownCard);

  return isJokerCCard(ccard);
}

// hacky name for now.
export function getCNatarebiColor(firstCard: CDownCard): CardColor {
  const ccard = getCCardFromCDownCard(firstCard);

  if (isJokerCCard(ccard)) {
    const cJokSubAction = getCJokerSubActionFromCDownCard(firstCard);
    const cJokSubActionColor = getColorFromCJokerSubAction(cJokSubAction);
    return cJokSubActionColor;
  }

  return getColorFromCCard(ccard);
}

export function maxNumber(arr: number[]) {
  let max = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max)
      max = arr[i];
  }

  return max;
}
