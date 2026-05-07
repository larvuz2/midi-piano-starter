import type { MidiManager } from '../midi/midiManager';

export function createConnectMidiButton(manager: MidiManager, onChange: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'primary-button';
  button.textContent = 'Connect MIDI Device';
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Requesting MIDI…';
    await manager.connect();
    button.disabled = false;
    button.textContent = manager.status === 'connected' ? 'Reconnect MIDI Device' : 'Connect MIDI Device';
    onChange();
  });
  return button;
}
