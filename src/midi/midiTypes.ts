export type MidiEvent =
  | { type: 'noteon'; channel: number; note: number; velocity: number; rawVelocity: number }
  | { type: 'noteoff'; channel: number; note: number; velocity: number; rawVelocity: number }
  | { type: 'controlchange'; channel: number; controller: number; value: number; rawValue: number }
  | { type: 'pitchbend'; channel: number; value: number; rawValue: number }
  | { type: 'programchange'; channel: number; program: number }
  | { type: 'aftertouch'; channel: number; pressure: number; rawPressure: number };

export type MidiConnectionStatus = 'idle' | 'unsupported' | 'requesting' | 'connected' | 'error';

export interface MidiInputDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state?: string;
}

export interface MidiMessageLogEntry {
  id: number;
  receivedAt: number;
  deviceName: string;
  rawData: number[];
  event: MidiEvent;
}

export interface MidiAccessLike {
  inputs: Map<string, MidiInputLike>;
  onstatechange: ((event: Event) => void) | null;
}

export interface MidiInputLike extends EventTarget {
  id: string;
  name: string | null;
  manufacturer: string | null;
  state?: string;
  onmidimessage: ((event: MidiMessageEventLike) => void) | null;
}

export interface MidiMessageEventLike {
  data: Uint8Array;
  currentTarget: EventTarget | null;
  target: EventTarget | null;
}
