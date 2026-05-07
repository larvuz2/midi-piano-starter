import type p5 from 'p5';
import type { VisualState } from '../../state/visualState';

export function createGridPulseSketch(state: VisualState) {
  return (p: p5) => {
    p.setup = () => p.createCanvas(1024, 1024);
    p.draw = () => {
      p.background(5, 6, 20);
      const cells = 8 + Math.floor(state.controls.knob1 * 24);
      const step = p.width / cells;
      for (let x = 0; x < cells; x += 1) {
        for (let y = 0; y < cells; y += 1) {
          const pulse = Math.sin(p.frameCount * 0.04 + x + y) * 0.5 + 0.5;
          p.fill(60 + state.scene.colorShift * 180, 100 + pulse * 155, 255, 80 + state.scene.energy * 160);
          p.noStroke();
          p.rect(x * step, y * step, step * (0.25 + pulse * 0.7), step * (0.25 + state.controls.knob2 * 0.7));
        }
      }
    };
  };
}
