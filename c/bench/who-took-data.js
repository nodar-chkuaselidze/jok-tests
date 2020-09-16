
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const {bench} = require('./utils');
const types = require('./types');

const ROOT = path.join(__dirname, '..');
const WASM_FILE = path.join(ROOT, 'build.wasm/libjok.wasm');

if (!fs.existsSync(WASM_FILE))
  throw new Error('Please compile to wasm first.');

const dataDir = path.join(__dirname, '../../data/whoTook');

let sliceDataset = undefined;

for (let arg of process.argv) {
  if (arg === '-h' || arg === '--help') {
    console.log('Benchmarks available:');

    console.log('--slice=n\tRun only n json files (for debugging)');
    process.exit(1);
  }

  if (arg.startsWith('--slice=')) {
    sliceDataset = parseInt(arg.substr(8));
    continue;
  }
}

const data = fs.readdirSync(dataDir)
  .filter(file => file.match(/\.json$/))
  .slice(0, sliceDataset)
  .map(filename => require(path.join(dataDir, filename)))
  .flat()
  .map(d => {
    return {
      cards: d.downCards.map((dcard) => {
        let jok_want = false;
        let jok_color = 0;

        if (dcard[2]) {
          jok_want = dcard[2].want;
          jok_color = dcard[2].color || types.JK_NULL;
        }

        return [
          dcard[0], dcard[1], jok_color, jok_want
        ]
      }),
      trump: d.trumpColor,
      firstCardIndex: d.stepFirstPlayerIndex
    }
  });

(async () => {
  const whoTook = await getWhoTookFn();

  const end = bench('who-took-wasm');
  for (let i = 0; i < data.length; i++) {
    whoTook(data[i].cards, data[i].trump, data[i].firstCardIndex);
  }

  end(data.length);
})().then(() => {
  console.log('Done.');
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
      played_cards.push(jk_create_played_card(
        card[0], card[1], card[2], card[3]
      ));
    }

    return jk_who_took_wasm(
      ...played_cards,
      trump,
      firstCardIndex
    );
  };
}
