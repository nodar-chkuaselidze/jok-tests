import * as fs from 'fs';
import * as path from 'path';
import { Card, CardColor } from '../lib/types';
import { whoTook1 } from '../lib/jok.js';

describe('whoTook.stress', () => {
  let fileDataItems: { name: string; data: string }[] = [];

  beforeAll(() => {
    const dataPath = path.join(__dirname, '../../data/whoTook');

    // load data in memory
    fileDataItems = fs
      .readdirSync(dataPath)
      .filter(x => x !== '.DS_Store')
      .map(filename => ({
        name: filename,
        data: fs.readFileSync(path.join(dataPath, filename), {
          encoding: 'utf8',
        }),
      }));
  });

  it('should pass all tests', () => {
    // run tests
    fileDataItems.forEach(file => {
      const tests: TestData[] = JSON.parse(file.data);

      tests.forEach(x => {
        expect(
          whoTook1(
            x.downCards,
            x.trumpColor,
            x.stepFirstPlayerIndex,
          ),
        ).toBe(x.stepWinnerPlayerIndex);
      });
    });
  });
});

interface TestData {
  section: number;
  round: number;
  step: number;
  downCards: Card[];
  trumpColor: CardColor;
  stepFirstPlayerIndex: number;
  stepWinnerPlayerIndex: number;
}
