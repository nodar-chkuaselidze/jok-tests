import { join } from 'path';
import {
  DownCard,
  CDownCard,
  CardColor
} from './types';

const root = join(__dirname, '..');
const bindings = require('node-gyp-build')(root);


type WhoTook1Fn = (
  playedCards: DownCard[],
  trumpColor: CardColor,
  firstIndex: Number
) => number;

type WhoTook2Fn = (
  playedCard1: CDownCard,
  playedCard2: CDownCard,
  playedCard3: CDownCard,
  playedCard4: CDownCard,
  trumpColor: CardColor,
  firstIndex: Number

) => number;

export const whoTook1: WhoTook1Fn = bindings.who_took1;
export const whoTook2: WhoTook2Fn = bindings.who_took2;
