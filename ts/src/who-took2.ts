import { CardColor, DownCard } from './types'
import { rotateArray, getNatarebiColor } from './utils'

export function whoTook2(
  cards: DownCard[],
  trumpColor: CardColor,
  firstCardIndex: number,
) {
  const jokerValues = rotateArray([0, 1, 2, 3], firstCardIndex)

  const firstCard = cards[firstCardIndex]
  const firstCardColor = getNatarebiColor(firstCard)

  // roca jokerma acxada rom surs kozirisgan gansxvavebuli peri.
  const jokerWantsNonTrump =
    firstCard[2]?.want && firstCard[2].color !== trumpColor

  const jokerDontWantColor =
    firstCard[2] && !firstCard[2].want ? firstCard[2].color : null

  const cardValues = cards.map(([color, level, jokerAction], i) => {
    const isFirstCard = i === firstCardIndex;

    if (jokerAction) {
      if (jokerAction.want) {
        let priority = 100;

        if (isFirstCard && jokerWantsNonTrump)
          priority = 20;

        return priority + jokerValues[i];
      }

      // jokers sheidzleba sheetenos.
      if (isFirstCard)
        return 1;

      // jokers aravitar shemtxvevashi ar miaqvs.
      return 0;
    }

    // ara jokeri.
    const isTrumpColor = color === trumpColor;
    const isFirstCardColor = color === firstCardColor;

    if (!isFirstCard && !isFirstCardColor && !isTrumpColor)
      return 0;

    const isJokerDontWantColor = color === jokerDontWantColor;

    let priority = level + 1;

    if (isTrumpColor)
      priority += 50;

    if (isJokerDontWantColor)
      priority += 20;

    return priority;
  });

  const max = Math.max(...cardValues)

  return cardValues.indexOf(max)
}
