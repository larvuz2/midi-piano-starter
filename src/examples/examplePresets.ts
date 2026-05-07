import type { VisualMode } from '../state/appStore';

export interface ExamplePreset { id: VisualMode; label: string; description: string }

export const examplePresets: ExamplePreset[] = [
  { id: 'shader-defense', label: 'Shader Defense Dance', description: 'Fullscreen radial pattern-defense shader inspired by live-coded p5 WebGL.' },
  { id: 'shader-organism', label: 'Shader Organism Field', description: 'Biological cellular pattern with MIDI-driven membranes and veins.' },
  { id: 'shader-cathedral', label: 'Shader Cathedral Glass', description: 'Architectural stained-glass arches and rhythmic columns.' },
  { id: 'tester', label: 'MIDI Device Tester', description: 'Inspect raw MIDI bytes and normalized parsed events.' },
  { id: 'three', label: 'Reactive Cube + Particles', description: 'Keys pulse scale; knobs alter spin, color, particles, and camera distance.' },
  { id: 'p5', label: 'p5 Generative Lines', description: 'p5 line density, opacity, stroke, and noise respond to shared state.' },
  { id: 'hybrid', label: 'p5 as Three Texture', description: 'A p5 grid is uploaded every frame as a Three.js material texture.' },
];
