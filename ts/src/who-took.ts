import { CardColor, DownCard } from './types';
import { getNatarebiColor, rotateArray } from './utils';

export function whoTook(
  cards: DownCard[],
  trumpColor: CardColor,
  firstCardIndex: number,
) {
  const jokerValues = rotateArray([0, 1, 2, 3], firstCardIndex);

  const firstCard = cards[firstCardIndex];
  const firstCardColor = getNatarebiColor(firstCard);

  // როცა ჯოკერმა აცხადა რომ სურს კოზირისგან განსხვავებული ფერი
  const jokerWantsNonTrump =
    firstCard[2]?.want && firstCard[2].color !== trumpColor;

  const jokerDontWantColor =
    firstCard[2] && !firstCard[2].want ? firstCard[2].color : null;

  const cardValues = cards.map(function (
    [color, level, jokerAction],
    i,
  ) {
    return jokerAction
      ? // თუ ჯოეკრია
        jokerAction.want
        ? // თუ სურს ჯოკერს
          (jokerWantsNonTrump && i === firstCardIndex ? 20 : 100) +
          // ბოლო ჩამოსულ ჯოკერს მეტი უპირატესობა აქვს
          jokerValues[i]
        : // თუ არ სურს ჯოკერს
        i === firstCardIndex
        ? 1
        : 0
      : // თუ არც ნატარები ფერია და არც კოზირი, მაშინ ვანულებთ
      i !== firstCardIndex &&
        color !== firstCardColor &&
        color !== trumpColor
      ? 0
      : level +
        // რადგან level-ი 0-დან იწყება
        1 +
        // კოზირს დამატებით 20 ქულა უპირატესობის მოსაპოვებლად
        // რადგან ფერში 9 კარტია მაქსიმუმ +20 ქულა საკმარისია
        (color === trumpColor ? 50 : 0) +
        // როდესაც ჯოკერმა აცხადა წაიღოსო და
        // კარტის ფერი დაემთხვა ნაცხადებ ფერს
        (color === jokerDontWantColor ? 20 : 0);
  });

  const max = Math.max(...cardValues);

  return cardValues.indexOf(max);
}
