import {
  getCardColor,
  getCardJokerColor,
  isJokerCard,
  PlayedCard,
} from './card.proposal';

export function rotateArray<T>(array: T[], by: number): T[] {
  const index = Math.abs(by % array.length);

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
          .concat(array.slice(0, array.length - index));
      }

      return array
        .slice(index, array.length)
        .concat(array.slice(0, index));
    }
  }
}

export function getNatarebiColor(firstCard: PlayedCard) {
  return isJokerCard(firstCard)
    ? getCardJokerColor(firstCard)
    : getCardColor(firstCard);
}

export function maxNumber(arr: number[]) {
  let max = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }

  return max;
}
