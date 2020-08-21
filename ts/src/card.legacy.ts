import {
  CardColor as NextCardColor,
  CardJokerAction,
  CardLevel as NextCardLevel,
  createPlayedCard,
} from '../src/card.proposal';
import { CardColor, CardLevel, DownCard } from './types';

export const legacyCard = {
  levelMap: {
    [CardLevel._6]: NextCardLevel._6,
    [CardLevel._7]: NextCardLevel._7,
    [CardLevel._8]: NextCardLevel._8,
    [CardLevel._9]: NextCardLevel._9,
    [CardLevel._10]: NextCardLevel._10,
    [CardLevel.Jack]: NextCardLevel.Jack,
    [CardLevel.Queen]: NextCardLevel.Queen,
    [CardLevel.King]: NextCardLevel.King,
    [CardLevel.Ace]: NextCardLevel.Ace,
  },

  colorMap: {
    [CardColor.None]: NextCardColor.None,
    [CardColor.Null]: NextCardColor.None,
    [CardColor.Hearts]: NextCardColor.Hearts,
    [CardColor.Diamonds]: NextCardColor.Diamonds,
    [CardColor.Spades]: NextCardColor.Spades,
    [CardColor.Clubs]: NextCardColor.Clubs,
  },

  createPlayedCard(x: DownCard) {
    return x[2]
      ? createPlayedCard(
          legacyCard.colorMap[x[0]],
          legacyCard.levelMap[x[1]],
          x[2].want ? CardJokerAction.Want : CardJokerAction.DontWant,
          legacyCard.colorMap[x[2].color]
            ? legacyCard.colorMap[x[2].color]
            : 0,
        )
      : createPlayedCard(
          legacyCard.colorMap[x[0]],
          legacyCard.levelMap[x[1]],
        );
  },
};
