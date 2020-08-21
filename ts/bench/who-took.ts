import { legacyCard } from '../src/card.legacy';
import {
  CardColor as NextCardColor,
  CardLevel as NextCardLevel,
} from '../src/card.proposal';
import { getCDownCardFromDownCard } from '../src/type-utils';
import { CardColor, CardLevel, DownCard } from '../src/types';
import { whoTook } from '../src/who-took';
import { whoTook2 } from '../src/who-took2';
import { whoTook3 } from '../src/who-took3';
import { whoTook4 } from '../src/who-took4';
import { whoTook5 } from '../src/who-took5';
import { whoTook6 } from '../src/who-took6-proposal';
import { whoTook6BL } from '../src/who-took6-pbranchless';
import { benchCollect } from './utils';

const N = 5000000;

const cases = [
  {
    name: 'all-hearts',
    trump: CardColor.Hearts,
    firstCardIndex: 3,
    cards: <DownCard[]>[
      [CardColor.Hearts, CardLevel._7],
      [CardColor.Hearts, CardLevel.Ace],
      [CardColor.Hearts, CardLevel.King],
      [CardColor.Hearts, CardLevel.Jack],
    ],
  },
  {
    name: 'win-trump',
    trump: CardColor.Diamonds,
    firstCardIndex: 1,
    cards: <DownCard[]>[
      [CardColor.Hearts, CardLevel._7],
      [CardColor.Hearts, CardLevel.Ace],
      [CardColor.Diamonds, CardLevel._6],
      [CardColor.Hearts, CardLevel.Jack],
    ],
  },
  {
    name: 'special-case',
    trump: CardColor.None,
    firstCardIndex: 2,
    cards: <DownCard[]>[
      [CardColor.Hearts, CardLevel._6],
      [CardColor.Hearts, CardLevel._8],
      [CardColor.Hearts, CardLevel._7],
      [CardColor.Hearts, CardLevel._10],
    ]
  }, {
    name: 'double-joker-wants',
    trump: CardColor.Clubs,
    firstCardIndex: 3,
    cards: <DownCard[]>[
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
    ],
  },
];

const bitCases = cases.map(tcase => {
  return {
    ...tcase,
    cards: tcase.cards.map(card => getCDownCardFromDownCard(card)),
  };
});

const bitXCases = cases.map(tcase => {
  return {
    ...tcase,
    cards: tcase.cards.map(legacyCard.createPlayedCard),
    trump: cardColorMap(tcase.trump),
  };
});

const whoTookEnabled = {
  'whoTook-1'            : true,
  'whoTook-2'            : true,
  'whoTook-3'            : true,
  'whoTook-4'            : true,
  'whoTook-5'            : true,
  'whoTook-6-proposal'   : true,
  'whoTook-6-branchless' : true
};

const whoTookMap = {
  'whoTook-6-branchless' : [ whoTook6BL, 'v3' ],
  'whoTook-6-proposal'   : [ whoTook6, 'v3' ],
  'whoTook-5'            : [ whoTook5, 'v2' ],
  'whoTook-4'            : [ whoTook4, 'v1' ],
  'whoTook-3'            : [ whoTook3, 'v1' ],
  'whoTook-2'            : [ whoTook2, 'v1' ],
  'whoTook-1'            : [ whoTook,  'v1' ],
};

function runBench(name: string, fn: any, data) {
  if (!whoTookEnabled[name])
    return {};

  const end = benchCollect(name, data.name);

  for (let i = 0; i < N; i++) {
    fn(
      data.cards,
      data.trump,
      data.firstCardIndex
    );
  }

  return end(N);
}

// run benchmarks by test cases
let table = [];
for (let i = 0; i < cases.length; i++) {
  const benchCase = cases[i];
  const bitCase = bitCases[i];
  const bitXCase = bitXCases[i];

  table.push(runBench('whoTook-6-branchless', whoTook6BL, bitXCase));
  table.push(runBench('whoTook-6-proposal', whoTook6, bitXCase));
  table.push(runBench('whoTook-5', whoTook5, bitCase));
  table.push(runBench('whoTook-4', whoTook4, benchCase));
  table.push(runBench('whoTook-3', whoTook3, benchCase));
  table.push(runBench('whoTook-2', whoTook2, benchCase));
  table.push(runBench('whoTook-1', whoTook, benchCase));
  table.push({});
}

console.table(table);

table = [];
// run benchmarks by whoTook methods
//for (const [name, [fn, type]] of Object.entries(whoTookMap)) {
//  for (let i = 0; i < cases.length; i++) {
//    switch (type) {
//      case 'v1':
//        table.push(runBench(name, fn, cases[i]));
//        break;
//      case 'v2':
//        table.push(runBench(name, fn, bitCases[i]));
//        break;
//      case 'v3':
//        table.push(runBench(name, fn, bitXCases[i]));
//        break;
//      default:
//        throw new Error('Could not find type');
//    }
//  }
//  table.push({});
//}

//console.table(table)

// helper wrapper
function cardColorMap(color) {
  return {
    [CardColor.None]: NextCardColor.None,
    [CardColor.Null]: NextCardColor.None,
    [CardColor.Hearts]: NextCardColor.Hearts,
    [CardColor.Diamonds]: NextCardColor.Diamonds,
    [CardColor.Spades]: NextCardColor.Spades,
    [CardColor.Clubs]: NextCardColor.Clubs,
  }[color];
}

//setInterval(() => {
//  console.log('here...');
//}, 1000);
