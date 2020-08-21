import * as fs from 'fs';
import { join } from 'path';
import { bench } from './utils';
import { CDownCard, CardColor, DownCard } from '../lib/types';
import { getCDownCardFromDownCard } from '../lib/type-utils';
import {
  whoTook1,
  whoTook2
} from '../lib/jok';

const dataDir = join(__dirname, '../../data/whoTook/');

const benchmarksEnabled = {
  'whoTook1': false,
  'whoTook2': false
};

let sliceDataset = undefined;

for (let arg of process.argv) {
  if (arg === '-h' || arg === '--help') {
    console.log('Benchmarks available:');

    console.log('--all\tenable all benchmarks');
    console.log('--slice=n\tRun only n json files (for debugging)');
    for (const key of Object.keys(benchmarksEnabled)) {
      console.log(`${key.replace('whoTook', '')}\t${key}`);
    }
    console.log('Example: node-ts bench/who-took-data -3 -6-proposal');
    process.exit(1);
  }

  if (arg.startsWith('--slice=')) {
    sliceDataset = parseInt(arg.substr(8));
    continue;
  }

  if (arg === '--all') {
    for (const k of Object.keys(benchmarksEnabled))
      benchmarksEnabled[k] = true;
    continue;
  }

  const name = `whoTook${arg}`;
  if (benchmarksEnabled.hasOwnProperty(name)) {
    benchmarksEnabled[name] = !benchmarksEnabled[name];
  }
}

const data: TestData[] = fs.readdirSync(dataDir)
  .filter(file => file.match(/\.json$/))
  .slice(0, sliceDataset)
  .map(filename => require(join(dataDir, filename)))
  .flat();

const dataV1 = data.map(bcase => {
  return {
    trump: bcase.trumpColor,
    cards: bcase.downCards,
    firstCardIndex: bcase.stepFirstPlayerIndex
  };
});

const dataV2 = data.map(bcase => {
  return {
    trump: bcase.trumpColor,
    cards: bcase.downCards.map(card => getCDownCardFromDownCard(card)),
    firstCardIndex: bcase.stepFirstPlayerIndex,
  };
});

const whoTook2Wrapper = (cards: CDownCard, trump: CardColor, firstCard: Number):number => {
  return whoTook2(cards[0], cards[1], cards[2], cards[3], trump, firstCard);
};

console.log('--- start... ----');

function runBench(name: string, fn: any, data: BenchmarkData[]) {
  if (!benchmarksEnabled[name])
    return {};

  const end = bench(name);

  for (let i = 0; i < data.length; i++) {
    fn(
      data[i].cards,
      data[i].trump,
      data[i].firstCardIndex
    );
  }

  end(data.length);
}

runBench('whoTook1', whoTook1, dataV1);
runBench('whoTook2', whoTook2Wrapper, dataV2);

console.log('--- done ---');


interface TestData {
  section: number;
  round: number;
  step: number;
  downCards: DownCard[];
  trumpColor: CardColor;
  stepFirstPlayerIndex: number;
  stepWinnerPlayerIndex: number;
}

interface BenchmarkData {
  cards: any[];
  trump: any;
  firstCardIndex: any
}
