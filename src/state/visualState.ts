import type { MidiEvent, MidiMessageLogEntry } from '../midi/midiTypes';

export interface VisualState {
  midi: {
    connected: boolean;
    deviceName: string | null;
    lastEvent: MidiEvent | null;
    messages: MidiMessageLogEntry[];
  };
  controls: {
    knob1: number;
    knob2: number;
    knob3: number;
    knob4: number;
    fader1: number;
    fader2: number;
    pitchBend: number;
    modWheel: number;
  };
  triggers: {
    pad1: boolean;
    pad2: boolean;
    noteOn: boolean;
    lastNote: number | null;
    velocity: number;
    burst: number;
  };
  scene: {
    intensity: number;
    energy: number;
    colorShift: number;
    cameraDistance: number;
  };
  shader: {
    distortion: number;
    symmetry: number;
    repetition: number;
    morph: number;
    bloom: number;
    lineWeight: number;
    feedback: number;
    paletteIndex: number;
  };
  particles: { size: number; spread: number; speed: number; decay: number };
}

export const visualState: VisualState = {
  midi: { connected: false, deviceName: null, lastEvent: null, messages: [] },
  controls: { knob1: 0.25, knob2: 0.35, knob3: 0.45, knob4: 0.55, fader1: 0.5, fader2: 0.5, pitchBend: 0, modWheel: 0 },
  triggers: { pad1: false, pad2: false, noteOn: false, lastNote: null, velocity: 0, burst: 0 },
  scene: { intensity: 0.35, energy: 0, colorShift: 0.1, cameraDistance: 5 },
  shader: { distortion: 0.42, symmetry: 0.55, repetition: 0.62, morph: 0.38, bloom: 0.48, lineWeight: 0.35, feedback: 0.28, paletteIndex: 0 },
  particles: { size: 0.35, spread: 0.5, speed: 0.45, decay: 0.5 },
};

export function resetVisualState(): void {
  visualState.controls.knob1 = 0.25;
  visualState.controls.knob2 = 0.35;
  visualState.controls.knob3 = 0.45;
  visualState.controls.knob4 = 0.55;
  visualState.controls.fader1 = 0.5;
  visualState.controls.fader2 = 0.5;
  visualState.controls.pitchBend = 0;
  visualState.controls.modWheel = 0;
  visualState.triggers.pad1 = false;
  visualState.triggers.pad2 = false;
  visualState.triggers.noteOn = false;
  visualState.triggers.lastNote = null;
  visualState.triggers.velocity = 0;
  visualState.triggers.burst = 0;
  visualState.scene.intensity = 0.35;
  visualState.scene.energy = 0;
  visualState.scene.colorShift = 0.1;
  visualState.scene.cameraDistance = 5;
  visualState.shader.distortion = 0.42;
  visualState.shader.symmetry = 0.55;
  visualState.shader.repetition = 0.62;
  visualState.shader.morph = 0.38;
  visualState.shader.bloom = 0.48;
  visualState.shader.lineWeight = 0.35;
  visualState.shader.feedback = 0.28;
  visualState.shader.paletteIndex = 0;
}
