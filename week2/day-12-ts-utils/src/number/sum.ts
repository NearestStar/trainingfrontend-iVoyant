export function sum(numbers: number[]): number {
  return numbers.reduce((total, number) => total + number, 0);
}