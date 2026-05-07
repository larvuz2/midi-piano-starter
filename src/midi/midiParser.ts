import type { MidiEvent } from './midiTypes';
import { normalizeMidiValue, normalizePitchBend } from '../utils/normalize';

export function parseMidiMessage(data: Uint8Array | number[]): MidiEvent | null {
  const [status = 0, data1 = 0, data2 = 0] = Array.from(data);
  const command = status & 0xf0;
  const channel = (status & 0x0f) + 1;

  switch (command) {
    case 0x80:
      return { type: 'noteoff', channel, note: data1, velocity: normalizeMidiValue(data2), rawVelocity: data2 };
    case 0x90:
      if (data2 === 0) {
        return { type: 'noteoff', channel, note: data1, velocity: 0, rawVelocity: 0 };
      }
      return { type: 'noteon', channel, note: data1, velocity: normalizeMidiValue(data2), rawVelocity: data2 };
    case 0xb0:
      return { type: 'controlchange', channel, controller: data1, value: normalizeMidiValue(data2), rawValue: data2 };
    case 0xc0:
      return { type: 'programchange', channel, program: data1 };
    case 0xd0:
      return { type: 'aftertouch', channel, pressure: normalizeMidiValue(data1), rawPressure: data1 };
    case 0xe0: {
      const rawValue = (data2 << 7) + data1;
      return { type: 'pitchbend', channel, value: normalizePitchBend(rawValue), rawValue };
    }
    default:
      return null;
  }
}
