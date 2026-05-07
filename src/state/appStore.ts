export type VisualMode = 'tester' | 'three' | 'p5' | 'hybrid' | 'shader-defense' | 'shader-organism' | 'shader-cathedral';

export interface AppStore {
  visualMode: VisualMode;
  debugVisible: boolean;
  selectedPreset: string;
  sidebarVisible: boolean;
}

export const appStore: AppStore = {
  visualMode: 'shader-defense',
  debugVisible: true,
  selectedPreset: 'shader-defense',
  sidebarVisible: true,
};
