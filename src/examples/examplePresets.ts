import type { VisualMode } from '../state/appStore';

export interface ExamplePreset { id: string; label: string; mode: VisualMode; description: string }

export const examplePresets: ExamplePreset[] = [
  { id: 'device-tester', label: 'MIDI Device Tester', mode: 'tester', description: 'Inspect raw MIDI bytes and normalized parsed events.' },
  { id: 'reactive-cube', label: 'Reactive Cube', mode: 'three', description: 'Keys pulse scale; knobs alter spin, color, and camera distance.' },
  { id: 'particle-field', label: 'Particle Field', mode: 'three', description: 'Notes and velocity drive particle energy, size, spread, and decay.' },
  { id: 'generative-lines', label: 'p5 Generative Lines', mode: 'p5', description: 'p5 line density, opacity, stroke, and noise respond to shared state.' },
  { id: 'hybrid-texture', label: 'p5 as Three Texture', mode: 'hybrid', description: 'A p5 grid is uploaded every frame as a Three.js material texture.' },
];
