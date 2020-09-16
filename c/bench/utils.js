const {performance} = require('perf_hooks');

exports.bench = function bench(name) {
  const start = performance.now();

  return function end(ops) {
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

exports.benchCollect = function benchCollect(name, caseName) {
  const start = performance.now();

  return function end(ops) {
    const elapsed = performance.now();
    const time = (elapsed - start) / 1e3;
    const rate = ops / time;

    return { name, case: caseName, ops, time, rate: Math.round(rate) };
  }
}

