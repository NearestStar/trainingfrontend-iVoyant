export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value");
  }

  return Math.min(Math.max(value, min), max);
}