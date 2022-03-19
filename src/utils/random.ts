function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

function getRandomNumberInRange(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function realGauss(mu = 0, sigma = 1): number {
  let radius;
  let z1;
  let z2;

  do {
    z1 = 2 * Math.random() - 1;
    z2 = 2 * Math.random() - 1;
    radius = z1 * z1 + z2 * z2;
  } while (radius >= 1 || radius === 0); // only use inside the unit circle

  const marsaglia = Math.sqrt((-2 * Math.log(radius)) / radius);
  return z1 * marsaglia * sigma + mu;
}

function uniform(a: number, b: number): number {
  return Math.random() * (b - a) + a;
}

export { getRandomNumber, getRandomNumberInRange, realGauss, uniform };
