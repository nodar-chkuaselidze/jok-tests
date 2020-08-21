import * as fs from 'fs';
import { join } from 'path';
import { legacyCard } from '../src/card.legacy';
import { bench } from './utils';
import {
  CardColor as NextCardColor
} from '../src/card.proposal';
import { getCDownCardFromDownCard } from '../src/type-utils';
import { CardColor, DownCard } from '../src/types';
import { whoTook } from '../src/who-took';
import { whoTook2 } from '../src/who-took2';
import { whoTook3 } from '../src/who-took3';
import { whoTook4 } from '../src/who-took4';
import { whoTook5 } from '../src/who-took5';
import { whoTook6 } from '../src/who-took6-proposal';
import { whoTook7 } from '../src/who-took7';

const dataDir = join(__dirname, '../../data/whoTook');

const benchmarksEnabled = {
  'whoTook-1'            : false,
  'whoTook-2'            : false,
  'whoTook-3'            : false,
  'whoTook-4'            : false,
  'whoTook-5'            : false,
  'whoTook-6-proposal'   : false,
  'whoTook-7'            : false,
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

const dataV3 = data.map(bcase => {
  return {
    cards: bcase.downCards.map(legacyCard.createPlayedCard),
    trump: cardColorMap(bcase.trumpColor),
    firstCardIndex: bcase.stepFirstPlayerIndex
  };
});

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

runBench('whoTook-7', whoTook7, dataV3);
runBench('whoTook-6-proposal', whoTook6, dataV3);
runBench('whoTook-5', whoTook5, dataV2);
runBench('whoTook-4', whoTook4, dataV1);
runBench('whoTook-3', whoTook3, dataV1);
runBench('whoTook-2', whoTook2, dataV1);
runBench('whoTook-1', whoTook, dataV1);

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

function cardColorMap(color: CardColor) {
  return {
    [CardColor.None]: NextCardColor.None,
    [CardColor.Null]: NextCardColor.None,
    [CardColor.Hearts]: NextCardColor.Hearts,
    [CardColor.Diamonds]: NextCardColor.Diamonds,
    [CardColor.Spades]: NextCardColor.Spades,
    [CardColor.Clubs]: NextCardColor.Clubs,
  }[color];
}
