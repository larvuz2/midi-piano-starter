import { MidiManager } from '../midi/midiManager';
import { ingestMidiMessage, tickMidiState } from '../midi/midiStore';
import { P5Engine } from '../engines/p5/P5Engine';
import { createGenerativeLinesSketch } from '../visuals/p5/GenerativeLines';
import { createGridPulseSketch } from '../visuals/p5/GridPulse';
import { ThreeEngine } from '../engines/three/ThreeEngine';
import { ParticleField } from '../visuals/three/ParticleField';
import { ReactiveCube } from '../visuals/three/ReactiveCube';
import { ShaderPlane } from '../visuals/three/ShaderPlane';
import { appStore } from '../state/appStore';
import { resetVisualState, visualState } from '../state/visualState';
import { RafLoop } from '../utils/raf';
import { createConnectMidiButton } from '../ui/connectMidiButton';
import { renderDebugPanel } from '../ui/debugPanel';
import { renderDeviceStatus } from '../ui/deviceStatus';
import { createVisualSelector } from '../ui/visualSelector';

export class App {
  private readonly midiManager = new MidiManager();
  private threeEngine: ThreeEngine | null = null;
  private p5Engine: P5Engine | null = null;
  private readonly loop = new RafLoop((delta) => this.tick(delta));
  private surface!: HTMLDivElement;
  private status!: HTMLDivElement;
  private debug!: HTMLDivElement;

  constructor(private readonly root: HTMLElement) {}

  start(): void {
    this.root.innerHTML = `
      <main class="shell">
        <section class="hero">
          <p class="eyebrow">Web MIDI · Three.js · p5.js · TypeScript</p>
          <h1>MIDI Web Visuals Starter</h1>
          <p>Connect a USB MIDI controller through a user gesture, parse native Web MIDI events, map them into shared state, and drive modular creative visuals.</p>
        </section>
        <section class="toolbar"><div id="connect-slot"></div><label>Visual mode <span id="selector-slot"></span></label><button id="reset-button">Reset State</button><button id="debug-toggle">Toggle Debug</button></section>
        <section id="device-status" class="device-status"></section>
        <section id="visual-surface" class="visual-surface"></section>
        <section id="debug-panel" class="panel"></section>
      </main>`;
    this.surface = this.root.querySelector('#visual-surface')!;
    this.status = this.root.querySelector('#device-status')!;
    this.debug = this.root.querySelector('#debug-panel')!;
    this.root.querySelector('#connect-slot')!.appendChild(createConnectMidiButton(this.midiManager, () => this.renderPanels()));
    this.root.querySelector('#selector-slot')!.appendChild(createVisualSelector(() => this.mountVisual()));
    this.root.querySelector('#reset-button')!.addEventListener('click', () => { resetVisualState(); this.renderPanels(); });
    this.root.querySelector('#debug-toggle')!.addEventListener('click', () => { appStore.debugVisible = !appStore.debugVisible; this.renderPanels(); });
    this.midiManager.onMessage((entry) => { ingestMidiMessage(entry); this.renderPanels(); });
    this.midiManager.onStatusChange(() => this.renderPanels());
    this.mountVisual();
    this.loop.start();
  }

  private mountVisual(): void {
    this.threeEngine?.dispose();
    this.p5Engine?.dispose();
    this.threeEngine = null;
    this.p5Engine = null;
    this.surface.innerHTML = '';

    if (appStore.visualMode === 'tester') {
      this.surface.innerHTML = '<div class="tester-card"><h2>MIDI Device Tester</h2><p>Use the debug panel below to inspect device name, raw bytes, channels, notes, controllers, velocity, and normalized values.</p></div>';
    }
    if (appStore.visualMode === 'three') {
      this.threeEngine = new ThreeEngine(this.surface, visualState);
      this.threeEngine.mount(new ParticleField());
      this.threeEngine.mount(new ReactiveCube());
      this.threeEngine.start();
    }
    if (appStore.visualMode === 'p5') {
      this.p5Engine = new P5Engine(this.surface, visualState);
      this.p5Engine.mount(createGenerativeLinesSketch);
    }
    if (appStore.visualMode === 'hybrid') {
      const hidden = document.createElement('div');
      hidden.className = 'hidden-p5';
      this.surface.appendChild(hidden);
      this.p5Engine = new P5Engine(hidden, visualState);
      const canvas = this.p5Engine.mount(createGridPulseSketch);
      this.threeEngine = new ThreeEngine(this.surface, visualState);
      this.threeEngine.mount(new ShaderPlane(canvas));
      this.threeEngine.mount(new ParticleField());
      this.threeEngine.start();
    }
    this.renderPanels();
  }

  private tick(delta: number): void {
    tickMidiState(delta);
  }

  private renderPanels(): void {
    this.status.innerHTML = renderDeviceStatus(this.midiManager);
    this.debug.hidden = !appStore.debugVisible;
    this.debug.innerHTML = renderDebugPanel(visualState);
  }
}
