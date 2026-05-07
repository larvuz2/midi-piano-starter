import type p5 from 'p5';
import { colorPalettes, hexToRgb01 } from '../../state/palettes';
import type { VisualState } from '../../state/visualState';

const vert = `
precision highp float;
attribute vec3 aPosition;
void main() {
  gl_Position = vec4(aPosition, 1.0);
}`;

const fragmentPrelude = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float energy;
uniform float velocity;
uniform float lastNote;
uniform float distortion;
uniform float symmetry;
uniform float repetition;
uniform float morph;
uniform float bloom;
uniform float lineWeight;
uniform float feedback;
uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorC;
uniform vec3 colorD;

#define PI 3.14159265359

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec3 palette(float t) {
  vec3 a = mix(colorA, colorB, smoothstep(0.0, 0.45, t));
  vec3 b = mix(colorC, colorD, smoothstep(0.35, 1.0, t));
  return mix(a, b, smoothstep(0.25, 0.95, abs(sin(t * PI))));
}
`;

const defenseFragment = `${fragmentPrelude}
void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  float note = max(lastNote, 36.0) / 127.0;
  float arms = 3.0 + floor(symmetry * 11.0) + floor(note * 5.0);
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle + PI / arms, 2.0 * PI / arms) - PI / arms;
  uv = vec2(cos(angle), sin(angle)) * radius;
  uv *= rot(time * (0.18 + distortion) + energy * 2.4);
  float rings = sin(radius * (18.0 + repetition * 70.0) - time * (2.0 + velocity * 9.0));
  float blade = abs(sin(atan(uv.y, uv.x) * arms + sin(radius * 8.0 - time) * morph * 4.0));
  float edge = smoothstep(0.02 + lineWeight * 0.16, 0.0, abs(rings) * 0.08 + blade * 0.018);
  float aura = exp(-radius * (1.6 - bloom * 0.8)) * (0.25 + energy);
  vec3 col = palette(radius + blade + time * 0.04 + note) * (edge * (1.3 + bloom * 2.0) + aura);
  col += colorD * pow(max(0.0, 1.0 - radius), 2.0) * energy;
  gl_FragColor = vec4(col, 1.0);
}`;

const organismFragment = `${fragmentPrelude}
void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  float note = max(lastNote, 12.0) / 127.0;
  uv *= 1.0 + sin(time * 0.17 + note * 6.0) * 0.08;
  float cells = 5.0 + repetition * 24.0;
  vec2 g = uv * cells;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float n = noise(id * 0.22 + time * 0.18);
  f *= rot(n * 6.28 + time * (0.25 + distortion) + energy * 2.0);
  float membrane = abs(length(f) - (0.18 + 0.16 * sin(n * 6.28 + time + note * 8.0 + velocity * 4.0)));
  float veins = abs(sin((f.x + f.y + n) * (12.0 + symmetry * 42.0) + time * (1.0 + morph * 3.0)));
  float ink = smoothstep(0.08 + lineWeight * 0.12, 0.0, membrane) + smoothstep(0.08, 0.0, veins * membrane);
  float fog = noise(uv * (3.0 + morph * 8.0) + time * 0.1);
  vec3 col = palette(n + fog * 0.4 + note + energy * 0.2) * (ink + fog * bloom * 0.9);
  col = mix(col, colorA, smoothstep(0.7, 1.8, length(uv)) * (0.45 + feedback));
  gl_FragColor = vec4(col, 1.0);
}`;

const cathedralFragment = `${fragmentPrelude}
void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  float note = max(lastNote, 24.0) / 127.0;
  uv.y += sin(uv.x * (2.0 + repetition * 10.0) + time) * distortion * 0.22;
  vec2 p = uv;
  p.x = abs(p.x);
  float arch = abs(length(vec2(p.x * (1.2 + symmetry), max(p.y + 0.18, 0.0))) - (0.42 + morph * 0.42));
  float columns = abs(sin((uv.x + sin(uv.y * 2.0 + time) * 0.03) * (12.0 + repetition * 56.0)));
  float glass = sin((atan(uv.y, uv.x) + time * 0.08) * (6.0 + symmetry * 18.0) + length(uv) * 18.0 - note * 8.0);
  float line = smoothstep(0.07 + lineWeight * 0.13, 0.0, min(arch, columns * 0.07));
  float halo = pow(max(0.0, 1.4 - length(uv)), 2.0) * (0.12 + bloom + energy);
  vec3 col = palette(glass * 0.35 + length(uv) + note + time * 0.03) * (line * 1.6 + halo * 0.8);
  col += colorD * smoothstep(0.04, 0.0, abs(uv.y + 0.72 + sin(uv.x * 10.0) * 0.02)) * (0.4 + velocity);
  gl_FragColor = vec4(col, 1.0);
}`;

type ShaderVariant = 'defense' | 'organism' | 'cathedral';

export function createShaderDanceSketch(state: VisualState, variant: ShaderVariant) {
  return (p: p5) => {
    let shaderProgram: p5.Shader;
    const scale = Math.max(1, window.devicePixelRatio || 1);

    p.setup = () => {
      p.pixelDensity(scale);
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      shaderProgram = p.createShader(vert, fragmentForVariant(variant));
      p.noStroke();
    };

    p.windowResized = () => {
      p.pixelDensity(scale);
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
      const palette = colorPalettes[Math.round(state.shader.paletteIndex) % colorPalettes.length] ?? colorPalettes[0];
      p.shader(shaderProgram);
      shaderProgram.setUniform('resolution', [p.width * scale, p.height * scale]);
      shaderProgram.setUniform('time', p.millis() / 1000);
      shaderProgram.setUniform('energy', state.scene.energy);
      shaderProgram.setUniform('velocity', state.triggers.velocity);
      shaderProgram.setUniform('lastNote', state.triggers.lastNote ?? 60);
      shaderProgram.setUniform('distortion', state.shader.distortion + state.controls.knob1 * 0.3);
      shaderProgram.setUniform('symmetry', state.shader.symmetry);
      shaderProgram.setUniform('repetition', state.shader.repetition + state.controls.knob2 * 0.25);
      shaderProgram.setUniform('morph', state.shader.morph + state.controls.modWheel * 0.2);
      shaderProgram.setUniform('bloom', state.shader.bloom + state.scene.energy * 0.25);
      shaderProgram.setUniform('lineWeight', state.shader.lineWeight);
      shaderProgram.setUniform('feedback', state.shader.feedback);
      shaderProgram.setUniform('colorA', hexToRgb01(palette.colors[0]));
      shaderProgram.setUniform('colorB', hexToRgb01(palette.colors[1]));
      shaderProgram.setUniform('colorC', hexToRgb01(palette.colors[2]));
      shaderProgram.setUniform('colorD', hexToRgb01(palette.colors[3]));
      p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
    };
  };
}

function fragmentForVariant(variant: ShaderVariant): string {
  if (variant === 'organism') return organismFragment;
  if (variant === 'cathedral') return cathedralFragment;
  return defenseFragment;
}
