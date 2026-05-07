# MIDI Web Visuals Starter

A GitHub starter template for building browser-based MIDI-controlled visual applications using **Three.js**, **p5.js**, **TypeScript**, **Vite**, and the native **Web MIDI API**.

## What this is

This repo is a reusable foundation, not a one-off demo. It separates MIDI input, MIDI parsing, MIDI mapping, shared visual state, and rendering engines so new creative experiments can be added without reading raw controller numbers in every visual.

## Requirements

- Chrome or Edge desktop as the primary target
- USB MIDI keyboard/controller
- HTTPS in production or `localhost` during development
- Node.js 20+

## Quick Start

```bash
npm install
npm run dev
```

Then connect a MIDI controller, open the local Vite URL, and click **Connect MIDI Device**. The app intentionally requests `navigator.requestMIDIAccess({ sysex: false })` only from that button click.

## Project Modes

- **MIDI Device Tester**: confirms device access and displays raw bytes plus normalized events.
- **Three.js mode**: mounts modular Three.js visuals such as `ReactiveCube` and `ParticleField`.
- **p5.js mode**: mounts a p5 generative sketch that consumes shared state.
- **Hybrid p5 texture mode**: renders a hidden p5 canvas and uploads it as a live Three.js texture.

## Architecture

```txt
src/
  midi/      Web MIDI manager, parser, mappings, store, learn prototype
  state/     shared app and visual state
  engines/   independent Three.js and p5.js engines
  visuals/   reusable Three.js and p5.js modules
  ui/        connect button, status, selector, debug panel
  examples/  starter mappings and presets
```

Continuous controller values are normalized to `0–1`, pitch bend is normalized to `-1–1`, and keys/pads update trigger state. Visual modules consume `VisualState`, not raw MIDI messages.

## Adding a New Visual

Three.js modules implement:

```ts
export interface ThreeVisualModule {
  init(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void;
  update(delta: number, state: VisualState): void;
  dispose(): void;
}
```

p5 sketches are factories that receive `VisualState` and return a p5 sketch callback. Keep cleanup in engine `dispose()` methods and avoid direct MIDI listeners inside visuals.

## Creating a MIDI Mapping

Edit `src/midi/midiMappings.ts` or use the `MidiLearn` prototype as a starting point for a controller-specific editor. A mapping translates raw messages like `CC 74 value 96` into targets such as `controls.knob1`, `particles.size`, or `scene.triggerBurst`.

## Deployment

This repo is Netlify-ready:

- Build command: `npm run build`
- Publish directory: `dist`
- Config file: `netlify.toml`

Netlify deploys over HTTPS, which is required for Web MIDI outside localhost.

## Known Limitations

- Web MIDI is limited availability and is not reliable as a primary target in Safari or Firefox.
- Chrome/Edge require a permission prompt, so MIDI access must be requested from a user gesture.
- MIDI device names and controller numbers can vary by OS, browser, and controller preset.
- SysEx is disabled by default for safer permissions behavior.
