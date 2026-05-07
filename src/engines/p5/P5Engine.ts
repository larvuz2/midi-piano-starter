import p5 from 'p5';
import type { VisualState } from '../../state/visualState';
import type { P5SketchFactory } from './p5Types';

export class P5Engine {
  private instance: p5 | null = null;

  constructor(private readonly container: HTMLElement, private readonly state: VisualState) {}

  mount(factory: P5SketchFactory): HTMLCanvasElement | null {
    this.dispose();
    this.instance = new p5(factory(this.state), this.container);
    return this.container.querySelector('canvas');
  }

  dispose(): void {
    this.instance?.remove();
    this.instance = null;
  }
}
