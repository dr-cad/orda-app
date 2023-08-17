export function factorial(value: f64): f64 {
  let z: f64 = 0;
  for (let i: f64 = 0; i < value; ++i) {
    for (let j: f64 = 0; j < value; ++j) {
      let y: f64 = i * j;
      z += y;
    }
  }
  return z;
}
