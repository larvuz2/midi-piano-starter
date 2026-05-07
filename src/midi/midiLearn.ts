import type { MidiEvent } from './midiTypes';
import type { MidiMapping, MidiMappingTarget } from './midiMappings';

export class MidiLearn {
  private pendingTarget: MidiMappingTarget | null = null;

  start(target: MidiMappingTarget): void { this.pendingTarget = target; }
  cancel(): void { this.pendingTarget = null; }
  isLearning(target?: MidiMappingTarget): boolean { return target ? this.pendingTarget === target : this.pendingTarget !== null; }

  capture(event: MidiEvent): MidiMapping | null {
    if (!this.pendingTarget) return null;
    const target = this.pendingTarget;
    this.pendingTarget = null;
    if (event.type === 'controlchange') return { label: `Learned ${target}`, type: event.type, controller: event.controller, channel: event.channel, target };
    if (event.type === 'noteon' || event.type === 'noteoff') return { label: `Learned ${target}`, type: event.type, note: event.note, channel: event.channel, target };
    if (event.type === 'pitchbend') return { label: `Learned ${target}`, type: event.type, channel: event.channel, target };
    return null;
  }
}
