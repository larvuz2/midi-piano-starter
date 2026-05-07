export function normalizeMidiValue(value: number): number {
  return clamp(value / 127, 0, 1);
}

export function normalizePitchBend(rawValue: number): number {
  return clamp((rawValue - 8192) / 8192, -1, 1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
