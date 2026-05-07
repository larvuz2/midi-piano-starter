import * as THREE from 'three';

export function addDefaultLights(scene: THREE.Scene): void {
  scene.add(new THREE.AmbientLight(0x9fb4ff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 4);
  scene.add(key);
}
