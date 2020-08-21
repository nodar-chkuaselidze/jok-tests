
import { performance } from 'perf_hooks'

export function bench(name: string) {
  const start = performance.now();

  return function end(ops: number) {
    // ms
    const finish = performance.now();
    const elapsed = finish - start;

    // seconds
    const time = elapsed / 1e3;
    const rate = ops / time;
    const perOp = (elapsed * 1e6) / ops;

    console.log('%s: ops=%d, time=%ds, rate=%s ops/s %s ns/op',
      name, ops, time, Math.floor(rate), Math.floor(perOp));
  }
}

export function benchCollect(name: string, caseName: string) {
  const start = performance.now();

  return function end(ops: number) {
    const elapsed = performance.now();
    const time = (elapsed - start) / 1e3;
    const rate = ops / time;

    return { name, case: caseName, ops, time, rate: Math.round(rate) };
  }
}
