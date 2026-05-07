import type p5 from 'p5';
import type { VisualState } from '../../state/visualState';

export function createGenerativeLinesSketch(state: VisualState) {
  return (p: p5) => {
    let direction = 1;
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(4, 6, 16);
    };
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.draw = () => {
      if (state.triggers.noteOn) direction = state.triggers.lastNote && state.triggers.lastNote % 2 === 0 ? 1 : -1;
      p.background(4, 6, 16, 18 + state.particles.decay * 40);
      const density = 12 + Math.floor(state.controls.knob1 * 80);
      const hue = (state.scene.colorShift * 360 + p.frameCount * 0.4) % 360;
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.stroke(hue, 80, 95, 0.25 + state.controls.knob2 * 0.65);
      p.strokeWeight(1 + state.controls.knob3 * 8);
      for (let i = 0; i < density; i += 1) {
        const y = (i / density) * p.height;
        const noise = p.noise(i * 0.08, p.frameCount * 0.008 + state.controls.modWheel) * 180;
        const x = (p.frameCount * direction * (0.5 + state.controls.knob4 * 3) + noise + i * 23) % p.width;
        p.line(x, y, x + direction * (60 + state.triggers.velocity * 240), y + Math.sin(i + p.frameCount * 0.02) * 32);
      }
      p.colorMode(p.RGB, 255);
    };
  };
}
