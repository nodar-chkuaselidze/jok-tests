import { bench } from './utils'

const N = 1000000;
const arr = [50, 100, 0, 20];

const maxNormal = (arr) => {
  let max = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}

{
  const end = bench('Max.apply');

  for (let i = 0; i < N; i++) {
    const max = Math.max(...arr)
  }

  end(N);
}

{
  const end = bench('Max.normal');

  for (let i = 0; i < N; i++) {
    const max = maxNormal(arr);
  }

  end(N);
}
