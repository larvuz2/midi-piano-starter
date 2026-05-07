export interface ColorPalette {
  id: string;
  label: string;
  colors: [string, string, string, string];
}

export const colorPalettes: ColorPalette[] = [
  { id: 'defense-dance', label: 'Defense Dance', colors: ['#070516', '#2832ff', '#ff2a8a', '#f7e969'] },
  { id: 'bio-electric', label: 'Bio Electric', colors: ['#001219', '#00f5d4', '#00bbf9', '#fee440'] },
  { id: 'opera-glass', label: 'Opera Glass', colors: ['#10002b', '#5a189a', '#ff8500', '#f8f7ff'] },
  { id: 'infrared-forest', label: 'Infrared Forest', colors: ['#050505', '#1b998b', '#ed217c', '#fffd82'] },
  { id: 'mono-ghost', label: 'Mono Ghost', colors: ['#030712', '#4b5563', '#d1d5db', '#ffffff'] },
];

export function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const value = Number.parseInt(clean, 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}
