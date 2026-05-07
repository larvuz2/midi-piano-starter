import { clamp } from './normalize';

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * clamp(amount, 0, 1);
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const normalized = (value - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, normalized);
}
