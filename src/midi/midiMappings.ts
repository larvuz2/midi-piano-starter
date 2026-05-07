import type { MidiEvent } from './midiTypes';
import { visualState, type VisualState } from '../state/visualState';

export type MidiMappingTarget =
  | 'controls.knob1' | 'controls.knob2' | 'controls.knob3' | 'controls.knob4'
  | 'controls.fader1' | 'controls.fader2' | 'controls.modWheel' | 'controls.pitchBend'
  | 'shader.distortion' | 'shader.symmetry' | 'shader.repetition' | 'shader.morph' | 'shader.bloom' | 'shader.lineWeight' | 'shader.feedback' | 'particles.size' | 'particles.spread' | 'particles.speed' | 'particles.decay'
  | 'scene.intensity' | 'scene.colorShift' | 'scene.cameraDistance' | 'scene.triggerBurst'
  | 'triggers.pad1' | 'triggers.pad2';

export type MidiMapping = {
  label: string;
  type: MidiEvent['type'];
  target: MidiMappingTarget;
  channel?: number;
  controller?: number;
  note?: number;
  scale?: [number, number];
};

export const defaultMidiMappings: MidiMapping[] = [
  { label: 'Knob 1 / brightness', type: 'controlchange', controller: 74, target: 'controls.knob1' },
  { label: 'Knob 2 / repetition', type: 'controlchange', controller: 71, target: 'shader.repetition' },
  { label: 'Knob 3 / color shift', type: 'controlchange', controller: 76, target: 'scene.colorShift' },
  { label: 'Knob 4 / camera distance', type: 'controlchange', controller: 10, target: 'scene.cameraDistance', scale: [3, 9] },
  { label: 'Mod wheel / morph', type: 'controlchange', controller: 1, target: 'shader.morph' },
  { label: 'Expression / bloom', type: 'controlchange', controller: 11, target: 'shader.bloom' },
  { label: 'Pitch bend', type: 'pitchbend', target: 'controls.pitchBend' },
  { label: 'Pad 1 burst', type: 'noteon', note: 36, target: 'scene.triggerBurst' },
  { label: 'Pad 2 pulse', type: 'noteon', note: 38, target: 'triggers.pad2' },
  { label: 'Middle C pulse', type: 'noteon', note: 60, target: 'triggers.pad1' },
];

export function loadMappings(): MidiMapping[] {
  const saved = localStorage.getItem('midi-web-visuals:mappings');
  if (!saved) return defaultMidiMappings;
  try { return JSON.parse(saved) as MidiMapping[]; } catch { return defaultMidiMappings; }
}

export function saveMappings(mappings: MidiMapping[]): void {
  localStorage.setItem('midi-web-visuals:mappings', JSON.stringify(mappings, null, 2));
}

export function applyMidiMapping(event: MidiEvent, mappings = loadMappings(), state: VisualState = visualState): void {
  for (const mapping of mappings) {
    if (!matchesMapping(event, mapping)) continue;
    const value = valueForEvent(event, mapping);
    updateTarget(state, mapping.target, value);
  }
  if (event.type === 'noteon') {
    state.triggers.noteOn = true;
    state.triggers.lastNote = event.note;
    state.triggers.velocity = event.velocity;
    state.scene.energy = Math.min(1, state.scene.energy + event.velocity * 0.6);
  }
  if (event.type === 'noteoff') state.triggers.noteOn = false;
}

function matchesMapping(event: MidiEvent, mapping: MidiMapping): boolean {
  if (event.type !== mapping.type) return false;
  if (mapping.channel && 'channel' in event && event.channel !== mapping.channel) return false;
  if (event.type === 'controlchange') return mapping.controller === event.controller;
  if (event.type === 'noteon' || event.type === 'noteoff') return mapping.note === event.note;
  return true;
}

function valueForEvent(event: MidiEvent, mapping: MidiMapping): number {
  let value = 1;
  if (event.type === 'controlchange') value = event.value;
  if (event.type === 'noteon' || event.type === 'noteoff') value = event.velocity;
  if (event.type === 'pitchbend') value = event.value;
  if (mapping.scale && event.type !== 'pitchbend') {
    const [min, max] = mapping.scale;
    return min + (max - min) * value;
  }
  return value;
}

function updateTarget(state: VisualState, target: MidiMappingTarget, value: number): void {
  const assign = (path: string, next: number | boolean) => {
    const [scope, key] = path.split('.') as [keyof VisualState, string];
    (state[scope] as Record<string, unknown>)[key] = next;
  };
  if (target === 'scene.triggerBurst') {
    state.triggers.burst = Math.max(state.triggers.burst, value || 1);
    state.scene.energy = 1;
    return;
  }
  if (target.startsWith('triggers.')) assign(target, value > 0);
  else assign(target, value);
}
