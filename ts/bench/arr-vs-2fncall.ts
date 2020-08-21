import { bench } from './utils'
import { CCard } from '../src/types';
import {
  getCardFromCCard,
  getColorFromCCard,
  getLevelFromCCard,
  getCCardFromColorLevel,
  getCCardFromCard
} from '../src/type-utils';

const N = 10000000;
const ccard = 72 as CCard;

{
  const end = bench('return array');

  for (let i = 0; i < N; i++) {
    const [color, level] = getCardFromCCard(ccard);
  }

  end(N);
}

{
  const end = bench('2 fn calls');

  for (let i = 0; i < N; i++) {
    const color = getColorFromCCard(ccard);
    const level = getLevelFromCCard(ccard);
  }

  end(N);
}

{
  const card = getCardFromCCard(ccard);
  const end = bench('from Card');

  for (let i = 0; i < N; i++) {
    const ccard = getCCardFromCard(card);
  }

  end(N);
}

{
  const color = getColorFromCCard(ccard);
  const level = getLevelFromCCard(ccard);
  const end = bench('from color, level');

  for (let i = 0; i < N; i++) {
    const ccard = getCCardFromColorLevel(color, level);
  }

  end(N);
}
