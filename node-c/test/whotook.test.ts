import { CardColor, CardLevel, DownCard } from '../lib/types';
import { getCDownCardFromDownCard } from '../lib/type-utils';
import { whoTook1, whoTook2 } from '../lib/jok';

function whoTook2Wrapper(
  cards: DownCard[],
  trumpColor: CardColor,
  firstCardIndex: number,
) {
  const cDownCards = cards.map(getCDownCardFromDownCard);

  return whoTook2(
    cDownCards[0],
    cDownCards[1],
    cDownCards[2],
    cDownCards[3],
    trumpColor,
    firstCardIndex);
}

const testCases = {
  whoTook1: whoTook1,
  whoTook2: whoTook2Wrapper
};

for (let entry of Object.entries(testCases)) {
  describe(entry[0], () => {
    const whoTook = entry[1];

    it('should win Ace (in same colors)', () => {
      const cards: DownCard[] = [
        [CardColor.Hearts, CardLevel._7],
        [CardColor.Hearts, CardLevel.Ace],
        [CardColor.Hearts, CardLevel.King],
        [CardColor.Hearts, CardLevel.Jack],
      ];

      expect(whoTook(cards, CardColor.Hearts, 0)).toBe(1);
      expect(whoTook(cards, CardColor.Hearts, 1)).toBe(1);
      expect(whoTook(cards, CardColor.Hearts, 2)).toBe(1);
      expect(whoTook(cards, CardColor.Hearts, 3)).toBe(1);
      expect(whoTook(cards, CardColor.Clubs, 3)).toBe(1);
      expect(whoTook(cards, CardColor.Diamonds, 3)).toBe(1);
      expect(whoTook(cards, CardColor.Spades, 3)).toBe(1);
      expect(whoTook(cards, CardColor.None, 3)).toBe(1);
    });

    it('should win trump', () => {
      const cards: DownCard[] = [
        [CardColor.Hearts, CardLevel._7],
        [CardColor.Hearts, CardLevel.Ace],
        [CardColor.Diamonds, CardLevel._6],
        [CardColor.Hearts, CardLevel.Jack],
      ];

      expect(whoTook(cards, CardColor.Diamonds, 0)).toBe(2);
      expect(whoTook(cards, CardColor.Diamonds, 1)).toBe(2);
      expect(whoTook(cards, CardColor.Diamonds, 2)).toBe(2);
      expect(whoTook(cards, CardColor.Diamonds, 3)).toBe(2);
    });

    it('should win first card (in no color)', () => {
      const cards: DownCard[] = [
        [CardColor.Clubs, CardLevel._7],
        [CardColor.Diamonds, CardLevel.Ace],
        [CardColor.Hearts, CardLevel._6],
        [CardColor.Spades, CardLevel.Jack],
      ];

      // always trump is the winner
      expect(whoTook(cards, CardColor.None, 0)).toBe(0);
      expect(whoTook(cards, CardColor.None, 1)).toBe(1);
      expect(whoTook(cards, CardColor.None, 2)).toBe(2);
      expect(whoTook(cards, CardColor.None, 3)).toBe(3);
    });

    it('special case', () => {
      const cards: DownCard[] = [
        [CardColor.Hearts, CardLevel._6],
        [CardColor.Hearts, CardLevel._8],
        [CardColor.Hearts, CardLevel._7],
        [CardColor.Hearts, CardLevel._10],
      ];

      // always trump is the winner
      expect(whoTook(cards, CardColor.None, 2)).toBe(3);
    });

    it('special case2', () => {
      const cards: DownCard[] = [
        [CardColor.Diamonds, CardLevel._6],
        [CardColor.Clubs, CardLevel._7],
        [CardColor.Clubs, CardLevel._9],
        [CardColor.Diamonds, CardLevel.Queen],
      ];

      // always trump is the winner
      expect(whoTook(cards, CardColor.Clubs, 2)).toBe(2);
    });

    it('When Trump is Joker', () => {
      const cards: DownCard[] = [
        [CardColor.Diamonds, CardLevel.Queen],
        [CardColor.Spades, CardLevel.Queen],
        [CardColor.Hearts, CardLevel._6],
        [CardColor.Spades, CardLevel.King],
      ];

      // always trump is the winner
      expect(whoTook(cards, CardColor.None, 0)).toBe(0);
    });

    it('Double Jokers wants', () => {
      const cards: DownCard[] = [
        [
          CardColor.Clubs,
          CardLevel._6,
          { want: true, color: CardColor.Null },
        ],
        [CardColor.Hearts, CardLevel._7],
        [
          CardColor.Spades,
          CardLevel._6,
          { want: true, color: CardColor.Null },
        ],
        [CardColor.Diamonds, CardLevel._7],
      ];

      // always trump is the winner
      expect(whoTook(cards, CardColor.Clubs, 3)).toBe(2);
    });

    it('Joker dont want', () => {
      const cards: DownCard[] = [
        [CardColor.Diamonds, CardLevel._10],
        [
          CardColor.Clubs,
          CardLevel._6,
          { want: false, color: CardColor.Hearts },
        ],
        [CardColor.Hearts, CardLevel.King],
        [CardColor.Spades, CardLevel._8],
      ];

      // always trump is the winner
      expect(whoTook(cards, CardColor.None, 1)).toBe(2);
    });

    it('Double Jokers dont want', () => {
      const cards: DownCard[] = [
        [CardColor.Clubs, CardLevel._9],
        [CardColor.Clubs, CardLevel._6, { want: false, color: -1 }],
        [
          CardColor.Spades,
          CardLevel._6,
          { want: false, color: CardColor.Hearts },
        ],
        [CardColor.Hearts, CardLevel._6],
      ];

      // always trump is the winner
      expect(whoTook(cards, CardColor.None, 2)).toBe(3);
    });

    it('Joker wants non-Trump', () => {
      const cards: DownCard[] = [
        [CardColor.Diamonds, CardLevel._10],
        [
          CardColor.Spades,
          CardLevel._6,
          { want: true, color: CardColor.Hearts },
        ],
        [CardColor.Hearts, CardLevel.King],
        [CardColor.Spades, CardLevel._8],
      ];

      expect(whoTook(cards, CardColor.Diamonds, 1)).toBe(0);
      expect(whoTook(cards, CardColor.None, 1)).toBe(1);
      expect(whoTook(cards, CardColor.Clubs, 1)).toBe(1);
    });

    it('Joker wants non-Trump, but another Joker wants', () => {
      const cards: DownCard[] = [
        [
          CardColor.Spades,
          CardLevel._6,
          { want: true, color: CardColor.Diamonds },
        ],
        [CardColor.Clubs, CardLevel._10],
        [CardColor.Clubs, CardLevel._6, { want: true, color: null }],
        [CardColor.Diamonds, CardLevel._8],
      ];

      expect(whoTook(cards, CardColor.Clubs, 0)).toBe(2);
    });

    it("Joker don't want but still takes", () => {
      const cards: DownCard[] = [
        [CardColor.Diamonds, CardLevel._10],
        [
          CardColor.Spades,
          CardLevel._6,
          { want: false, color: CardColor.Hearts },
        ],
        [CardColor.Spades, CardLevel.King],
        [CardColor.Spades, CardLevel._8],
      ];

      expect(whoTook(cards, CardColor.None, 1)).toBe(1);
      expect(whoTook(cards, CardColor.Clubs, 1)).toBe(1);
      expect(whoTook(cards, CardColor.Diamonds, 1)).toBe(0);
    });

    it("Joker don't want", () => {
      const cards: DownCard[] = [
        [CardColor.Diamonds, CardLevel._10],
        [
          CardColor.Spades,
          CardLevel._6,
          { want: false, color: CardColor.Hearts },
        ],
        [CardColor.Spades, CardLevel.King],
        [CardColor.Spades, CardLevel._8],
      ];

      expect(whoTook(cards, CardColor.Diamonds, 1)).toBe(0);
      expect(whoTook(cards, CardColor.Spades, 1)).toBe(2);
    });

    it("Joker don't want and takes Trump", () => {
      const cards: DownCard[] = [
        [CardColor.Diamonds, CardLevel._10],
        [
          CardColor.Spades,
          CardLevel._6,
          { want: false, color: CardColor.Spades },
        ],
        [CardColor.Clubs, CardLevel.King],
        [CardColor.Spades, CardLevel._8],
      ];

      expect(whoTook(cards, CardColor.Clubs, 1)).toBe(2);
    });
  });
}
