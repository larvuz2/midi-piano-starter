import type { MidiEvent } from '../midi/midiTypes';
import type { VisualState } from '../state/visualState';

export function renderDebugPanel(state: VisualState): string {
  const last = state.midi.lastEvent ? JSON.stringify(state.midi.lastEvent) : 'Waiting for MIDI input…';
  const messages = state.midi.messages
    .map((entry) => `<li><code>${entry.rawData.join(' ')}</code> ${entry.event.type} ch.${entry.event.channel}${formatEvent(entry.event)}</li>`)
    .join('');
  return `
    <div class="debug-grid">
      <div><h3>Last MIDI Message</h3><pre>${last}</pre></div>
      <div><h3>Normalized Controls</h3><pre>${JSON.stringify({ controls: state.controls, scene: state.scene, shader: state.shader, particles: state.particles }, null, 2)}</pre></div>
    </div>
    <h3>Incoming MIDI Log</h3>
    <ol class="message-log">${messages || '<li>Connect a device and move a key, pad, fader, or knob.</li>'}</ol>
  `;
}

function formatEvent(event: MidiEvent): string {
  if (event.type === 'noteon' || event.type === 'noteoff') {
    return ` note ${event.note} velocity ${event.velocity.toFixed(2)}`;
  }
  if (event.type === 'controlchange') {
    return ` CC ${event.controller} value ${event.value.toFixed(2)} raw ${event.rawValue}`;
  }
  if (event.type === 'pitchbend') return ` bend ${event.value.toFixed(2)} raw ${event.rawValue}`;
  return '';
}
