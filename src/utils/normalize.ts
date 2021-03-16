export function normalize(value: number, max: number, min: number, a: number, b: number): number {
  return (b - a) * ((value - min) / (max - min)) + a;
}
