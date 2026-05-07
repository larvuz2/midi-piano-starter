import type p5 from 'p5';
import type { VisualState } from '../../state/visualState';

export type P5SketchFactory = (state: VisualState) => (sketch: p5) => void;
