import * as fs from 'fs';
import * as path from 'path';
import { legacyCard } from '../src/card.legacy';
import { Card, CardColor } from '../src/types';
import { whoTook6 } from '../src/who-took6-proposal';
import { whoTook6BL } from '../src/who-took6-pbranchless';
import { whoTook7 } from '../src/who-took7';

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
          whoTook7(
            x.downCards.map(legacyCard.createPlayedCard),
            legacyCard.colorMap[x.trumpColor],
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
