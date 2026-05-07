import { applyMidiMapping, loadMappings } from './midiMappings';
import type { MidiMessageLogEntry } from './midiTypes';
import { visualState } from '../state/visualState';

const maxMessages = 24;

export function ingestMidiMessage(entry: MidiMessageLogEntry): void {
  visualState.midi.connected = true;
  visualState.midi.deviceName = entry.deviceName;
  visualState.midi.lastEvent = entry.event;
  visualState.midi.messages = [entry, ...visualState.midi.messages].slice(0, maxMessages);
  applyMidiMapping(entry.event, loadMappings(), visualState);
}

export function tickMidiState(delta: number): void {
  visualState.scene.energy = Math.max(0, visualState.scene.energy - delta * 0.4);
  visualState.triggers.burst = Math.max(0, visualState.triggers.burst - delta * 1.8);
}
