import * as THREE from 'three';
import { createCamera } from './camera';
import { updateCameraFromState } from './controls';
import { addDefaultLights } from './lights';
import { createRenderer } from './renderer';
import { resizeRenderer } from './resize';
import { createScene } from './createScene';
import type { VisualState } from '../../state/visualState';
import { RafLoop } from '../../utils/raf';

export interface ThreeVisualModule {
  init(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void;
  update(delta: number, state: VisualState): void;
  dispose(): void;
}

export class ThreeEngine {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  private modules: ThreeVisualModule[] = [];
  private readonly loop: RafLoop;
  private readonly onResize = () => resizeRenderer(this.container, this.camera, this.renderer);

  constructor(private readonly container: HTMLElement, private readonly state: VisualState) {
    this.scene = createScene();
    this.camera = createCamera(container);
    this.renderer = createRenderer(container);
    addDefaultLights(this.scene);
    this.loop = new RafLoop((delta) => this.update(delta));
    window.addEventListener('resize', this.onResize);
  }

  mount(module: ThreeVisualModule): void {
    module.init(this.scene, this.renderer);
    this.modules.push(module);
  }

  start(): void { this.loop.start(); }

  update(delta: number): void {
    updateCameraFromState(this.camera, this.state);
    this.modules.forEach((module) => module.update(delta, this.state));
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.loop.stop();
    window.removeEventListener('resize', this.onResize);
    this.modules.forEach((module) => module.dispose());
    this.modules = [];
    this.renderer.domElement.remove();
    this.renderer.dispose();
  }
}
