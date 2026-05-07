import { colorPalettes } from '../state/palettes';
import type { VisualState } from '../state/visualState';

type NumericPath =
  | 'shader.distortion'
  | 'shader.symmetry'
  | 'shader.repetition'
  | 'shader.morph'
  | 'shader.bloom'
  | 'shader.lineWeight'
  | 'shader.feedback'
  | 'particles.size'
  | 'particles.spread'
  | 'particles.speed'
  | 'particles.decay'
  | 'scene.intensity'
  | 'scene.colorShift'
  | 'controls.knob1'
  | 'controls.knob2'
  | 'controls.knob3'
  | 'controls.knob4';

interface SliderDefinition {
  label: string;
  path: NumericPath;
  min?: number;
  max?: number;
  step?: number;
  help: string;
}

const sliders: SliderDefinition[] = [
  { label: 'Distortion', path: 'shader.distortion', help: 'Warps coordinates and makes the pattern feel more liquid.' },
  { label: 'Symmetry', path: 'shader.symmetry', help: 'Adds mirrored arms, arches, or cellular rotations.' },
  { label: 'Repetition', path: 'shader.repetition', help: 'Controls pattern density, rings, cells, and columns.' },
  { label: 'Morph', path: 'shader.morph', help: 'Animates shape interpolation and internal pattern drift.' },
  { label: 'Bloom', path: 'shader.bloom', help: 'Pushes glow, aura, and note-triggered brightness.' },
  { label: 'Line Weight', path: 'shader.lineWeight', help: 'Thickens contour lines and stained-glass edges.' },
  { label: 'Feedback', path: 'shader.feedback', help: 'Darkens falloff and creates a stronger framed composition.' },
  { label: 'Particle Size', path: 'particles.size', help: 'Shared with Three.js particles and available to mappings.' },
  { label: 'Particle Spread', path: 'particles.spread', help: 'Expands spatial range in particle-heavy modes.' },
  { label: 'Particle Speed', path: 'particles.speed', help: 'Increases kinetic drift and MIDI burst movement.' },
  { label: 'Scene Intensity', path: 'scene.intensity', help: 'Base scene brightness before MIDI energy is added.' },
  { label: 'Color Shift', path: 'scene.colorShift', help: 'Offsets hue and palette sampling in real time.' },
  { label: 'Virtual Knob 1', path: 'controls.knob1', help: 'Manual override for mapped MIDI knob 1.' },
  { label: 'Virtual Knob 2', path: 'controls.knob2', help: 'Manual override for mapped MIDI knob 2.' },
];

export function createParameterSidebar(state: VisualState, onChange: () => void): HTMLElement {
  const aside = document.createElement('aside');
  aside.className = 'parameter-sidebar';
  aside.innerHTML = `
    <div class="sidebar-heading">
      <p class="eyebrow">Live Controls</p>
      <h2>Shader Instrument</h2>
      <p>Move MIDI controls or sculpt the visualization manually. Every slider updates the shared state in real time.</p>
    </div>
    <div class="palette-section">
      <label for="palette-select">Color palette</label>
      <select id="palette-select"></select>
      <div class="palette-swatches" id="palette-swatches"></div>
    </div>
    <div class="slider-stack"></div>
  `;

  const paletteSelect = aside.querySelector<HTMLSelectElement>('#palette-select')!;
  const swatches = aside.querySelector<HTMLDivElement>('#palette-swatches')!;
  colorPalettes.forEach((palette, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = palette.label;
    paletteSelect.appendChild(option);
  });
  paletteSelect.value = String(Math.round(state.shader.paletteIndex));
  paletteSelect.addEventListener('change', () => {
    state.shader.paletteIndex = Number(paletteSelect.value);
    renderSwatches(swatches, state.shader.paletteIndex);
    onChange();
  });
  renderSwatches(swatches, state.shader.paletteIndex);

  const stack = aside.querySelector<HTMLDivElement>('.slider-stack')!;
  sliders.forEach((definition) => stack.appendChild(createSlider(definition, state, onChange)));
  return aside;
}

function createSlider(definition: SliderDefinition, state: VisualState, onChange: () => void): HTMLElement {
  const row = document.createElement('label');
  row.className = 'slider-row';
  const value = readPath(state, definition.path);
  row.innerHTML = `
    <span><strong>${definition.label}</strong><small>${definition.help}</small></span>
    <output>${value.toFixed(2)}</output>
    <input type="range" min="${definition.min ?? 0}" max="${definition.max ?? 1}" step="${definition.step ?? 0.01}" value="${value}">
  `;
  const input = row.querySelector<HTMLInputElement>('input')!;
  const output = row.querySelector<HTMLOutputElement>('output')!;
  input.addEventListener('input', () => {
    const next = Number(input.value);
    writePath(state, definition.path, next);
    output.value = next.toFixed(2);
    output.textContent = next.toFixed(2);
    onChange();
  });
  return row;
}

function renderSwatches(container: HTMLElement, paletteIndex: number): void {
  const palette = colorPalettes[Math.round(paletteIndex) % colorPalettes.length] ?? colorPalettes[0];
  container.innerHTML = palette.colors.map((color) => `<span style="background:${color}"></span>`).join('');
}

function readPath(state: VisualState, path: NumericPath): number {
  const [scope, key] = path.split('.') as [keyof VisualState, string];
  return Number((state[scope] as Record<string, unknown>)[key]);
}

function writePath(state: VisualState, path: NumericPath, value: number): void {
  const [scope, key] = path.split('.') as [keyof VisualState, string];
  (state[scope] as Record<string, unknown>)[key] = value;
}
