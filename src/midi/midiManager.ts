import { parseMidiMessage } from './midiParser';
import type { MidiAccessLike, MidiConnectionStatus, MidiEvent, MidiInputDevice, MidiInputLike, MidiMessageEventLike, MidiMessageLogEntry } from './midiTypes';
import { logger } from '../utils/logger';

export type MidiEventHandler = (entry: MidiMessageLogEntry) => void;
export type MidiStatusHandler = () => void;

export class MidiManager {
  status: MidiConnectionStatus = 'idle';
  devices: MidiInputDevice[] = [];
  lastError: string | null = null;
  private access: MidiAccessLike | null = null;
  private eventHandlers = new Set<MidiEventHandler>();
  private statusHandlers = new Set<MidiStatusHandler>();
  private messageId = 0;

  onMessage(handler: MidiEventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  onStatusChange(handler: MidiStatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  async connect(): Promise<void> {
    if (!('requestMIDIAccess' in navigator) || !navigator.requestMIDIAccess) {
      this.status = 'unsupported';
      this.lastError = 'Web MIDI is not available in this browser. Use Chrome or Edge desktop.';
      this.emitStatus();
      return;
    }

    this.status = 'requesting';
    this.lastError = null;
    this.emitStatus();

    try {
      const access = (await navigator.requestMIDIAccess({ sysex: false })) as unknown as MidiAccessLike;
      this.access = access;
      access.onstatechange = () => this.refreshInputs();
      this.refreshInputs();
      this.status = this.devices.length > 0 ? 'connected' : 'idle';
    } catch (error) {
      this.status = 'error';
      this.lastError = error instanceof Error ? error.message : 'Unable to request MIDI access.';
      logger.error(this.lastError);
    }
    this.emitStatus();
  }

  disconnect(): void {
    if (this.access) {
      for (const input of this.access.inputs.values()) input.onmidimessage = null;
      this.access.onstatechange = null;
    }
    this.access = null;
    this.devices = [];
    this.status = 'idle';
    this.emitStatus();
  }

  private refreshInputs(): void {
    if (!this.access) return;
    this.devices = Array.from(this.access.inputs.values()).map((input) => ({
      id: input.id,
      name: input.name ?? 'Unnamed MIDI input',
      manufacturer: input.manufacturer ?? undefined,
      state: input.state,
    }));
    for (const input of this.access.inputs.values()) {
      input.onmidimessage = (event) => this.handleMessage(event, input);
    }
    this.emitStatus();
  }

  private handleMessage(message: MidiMessageEventLike, input: MidiInputLike): void {
    const event: MidiEvent | null = parseMidiMessage(message.data);
    if (!event) return;
    const entry: MidiMessageLogEntry = {
      id: ++this.messageId,
      receivedAt: performance.now(),
      deviceName: input.name ?? 'Unnamed MIDI input',
      rawData: Array.from(message.data),
      event,
    };
    this.eventHandlers.forEach((handler) => handler(entry));
  }

  private emitStatus(): void {
    this.statusHandlers.forEach((handler) => handler());
  }
}
