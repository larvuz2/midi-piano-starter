import type p5 from 'p5';
import type { VisualState } from '../../state/visualState';

export function createMidiCirclesSketch(state: VisualState) {
  return (p: p5) => {
    p.setup = () => p.createCanvas(p.windowWidth, p.windowHeight);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.draw = () => {
      p.background(3, 5, 14, 80);
      const size = 30 + state.controls.knob1 * 260 + state.triggers.velocity * 160;
      p.noFill();
      p.stroke(100 + state.scene.colorShift * 155, 210, 255, 180);
      p.strokeWeight(2 + state.controls.knob2 * 10);
      p.circle(p.width / 2, p.height / 2, size);
    };
  };
}
