import type { MidiManager } from '../midi/midiManager';

export function renderDeviceStatus(manager: MidiManager): string {
  const devices = manager.devices.length ? manager.devices.map((device) => device.name).join(', ') : 'No MIDI inputs selected yet';
  const detail = manager.lastError ? `<p class="error">${manager.lastError}</p>` : '';
  return `<span class="status-dot status-${manager.status}"></span><strong>${manager.status}</strong><span>${devices}</span>${detail}`;
}
