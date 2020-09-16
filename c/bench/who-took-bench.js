'use strict';

const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

const ROOT = path.join(__dirname, '..');
const WASM_FILE = path.join(ROOT, 'build.wasm/libjok.wasm');
const {bench} = require('./utils');

if (!fs.existsSync(WASM_FILE))
  throw new Error('Please compile to wasm first.');

const types = require('./types');

const cases = [
  {
    name: 'all-hearts',
    trump: types.JK_HEARTS,
    firstCardIndex: 3,
    cards: [
      [types.JK_HEARTS, types.JK_07],
      [types.JK_HEARTS, types.JK_ACE],
      [types.JK_HEARTS, types.JK_KING],
      [types.JK_HEARTS, types.JK_JACK],
    ],
  },
  {
    name: 'win-trump',
    trump: types.JK_DIAMONDS,
    firstCardIndex: 1,
    cards: [
      [types.JK_HEARTS,   types.JK_07],
      [types.JK_HEARTS,   types.JK_ACE],
      [types.JK_DIAMONDS, types.JK_06],
      [types.JK_HEARTS,   types.JK_JACK],
    ],
  },
  {
    name: 'special-case',
    trump: types.JK_NONE,
    firstCardIndex: 2,
    cards: [
      [types.JK_HEARTS, types.JK_06],
      [types.JK_HEARTS, types.JK_08],
      [types.JK_HEARTS, types.JK_07],
      [types.JK_HEARTS, types.JK_10],
    ]
  }, {
    name: 'double-joker-wants',
    trump: types.JK_CLUBS,
    firstCardIndex: 3,
    cards: [
      [
        types.JK_CLUBS, types.JK_06,
        { want: true, color: types.JK_NULL },
      ],
      [types.JK_HEARTS, types.JK_07],
      [
        types.JK_SPADES,
        types.JK_06,
        { want: true, color: types.JK_NULL },
      ],
      [types.JK_DIAMONDS, types.JK_07],
    ],
  },
];

const N = 5000000;

(async () => {
  const whoTook = await getWhoTookFn();

  for (const bcase of cases) {
    const end = bench(bcase.name);
    for (let i = 0; i < N; i++) {
      whoTook(bcase.cards, bcase.trump, bcase.firstCardIndex);
    }
    end(N);
  }
})().then(() => {
  console.log('done');
}).catch((e) => {
  console.error(e);
});

async function getWhoTookFn() {
  const wasmBCode = await fsp.readFile(WASM_FILE);
  const compiled = await WebAssembly.compile(wasmBCode);
  const instance = await WebAssembly.instantiate(compiled);

  const {
    jk_create_played_card,
    jk_who_took_wasm
  } = instance.exports;

  return (cards, trump, firstCardIndex) => {
    const played_cards = [];

    for (const card of cards) {
      let jok_want = false;
      let jok_color = 0;

      if (card[2]) {
        jok_want = card[2].want;
        jok_color = card[2].color
      }

      played_cards.push(jk_create_played_card(
        card[0], card[1], jok_color, jok_want
      ));
    }

    return jk_who_took_wasm(
      ...played_cards,
      trump,
      firstCardIndex
    );
  };
}
