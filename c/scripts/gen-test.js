#!/usr/bin/env node

const path = require('path');
const fs = require('fs/promises');

const TEST_PER_FILE = 144;
const HEADER_FILE = path.join(__dirname, '../test/gen-data.h');
const DATA_DIR = path.join(__dirname, '../../data/whoTook');

let testCases = undefined;
let filesSlice = undefined;
let testName = undefined;
for (let arg of process.argv) {
  if (arg.startsWith('--test-cases=')) {
    testCases = parseInt(arg.substr(13));

    if (isNaN(testCases)) {
      testCases = undefined;
      continue;
    }

    filesSlice = Math.ceil(testCases / TEST_PER_FILE);
  }

  if (arg.startsWith('--test-name=')) {
    testName = arg.substr(12);

    if (testName == '')
      testName = undefined;
    break;
  }
}

(async () => {
  let data;

  if (testName) {
    data = getSpecificTest(testName);
  } else {
    data = await getAllTests(filesSlice, testCases);
  }

  const file = await fs.open(HEADER_FILE, 'w');

  await file.writeFile(getHeaders());
  await file.writeFile(structHeader());

  for (let i = 0; i < data.length; i++) {
    await file.writeFile(generateTest(data[i], i));
  }

  await file.writeFile(structEnd());
  await file.close();

})().then(() => {
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

async function getAllTests(filesSlice, testCases) {
  const directoryFiles = await fs.readdir(DATA_DIR);

  return directoryFiles.filter(file => file.match(/\.json$/))
    .slice(0, filesSlice)
    .map((filename) => {
      return require(path.join(DATA_DIR, filename)).map((d, i) => {
        d.fname = filename.replace(/\.json$/, '');
        d.findex = i;
        return d;
      });
    })
    .flat()
    .slice(0, testCases);
}

function getSpecificTest(testName) {
  const test = testName.split('-');
  const fileName = test[1] + '.json';
  const testIndex = test[2];
  const data = require(path.join(DATA_DIR, fileName));
  const testCase = data[testIndex];

  testCase.fname = test[1];
  testCase.findex = testIndex;

  return [ testCase ];
}

function getCCardLevel(level) {
  return {
    0: 'JK_06',
    1: 'JK_07',
    2: 'JK_08',
    3: 'JK_09',
    4: 'JK_10',
    5: 'JK_JACK',
    6: 'JK_QUEEN',
    7: 'JK_KING',
    8: 'JK_ACE',
  }[level];
}

function getCCardColor(color) {
  if (color == null || color == -1) {
    return '-1';
  }

  return {
    0: 'JK_HEARTS',
    1: 'JK_DIAMONDS',
    2: 'JK_SPADES',
    3: 'JK_CLUBS',
    4: 'JK_NONE',
    5: 'JK_NULL',
  }[color];
}

function getCCardAction(action) {
  if (!action)
    return null;

  return {
    want: action.want,
    color: getCCardColor(action.color)
  }
}

function getCCard(card) {
  return {
    color: getCCardColor(card[0]),
    level: getCCardLevel(card[1]),
    action: getCCardAction(card[2])
  }
}

function generateCard(card) {
  if (card.action) {
    return `GET_JOK_CARD(${card.color}, ${card.level}, `
      +`${card.action.want}, ${card.action.color}),`;
  }

  return `GET_CARD(${card.color}, ${card.level}),`;
}

function generateCase(trumpColor, firstPlayerIndex, expected) {
  return `GET_CASE(${trumpColor}, ${firstPlayerIndex}, ${expected})`;
}

function generateTest(data, i) {
  const {
    downCards,
    trumpColor,
    fname,
    findex,
    stepFirstPlayerIndex,
    stepWinnerPlayerIndex
  } = data;

  const cards = downCards.map(getCCard).map(generateCard).join('\n      ');
  const cTrumpColor = getCCardColor(trumpColor);

  return `  {
    .name = "test-${fname}-${findex}-${i}",
    .cards = {
      ${cards}
    },
    .no_cases = 1,
    .cases = {
      ${generateCase(cTrumpColor, stepFirstPlayerIndex, stepWinnerPlayerIndex)}
    }
  },\n`;
}

function getHeaders() {
  return `
#include <assert.h>
#include <stdio.h>
#include "test.h"
`;
}

function structHeader() {
  return `
_Pragma("GCC diagnostic push")
_Pragma("GCC diagnostic ignored \\"-Wsign-conversion\\"")
test_data_entry_t STRESS_TESTS[] = {\n`
}

function structEnd() {
  return `};
_Pragma("GCC diagnostic pop")\n`;
}
