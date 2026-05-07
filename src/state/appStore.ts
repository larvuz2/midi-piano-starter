export type VisualMode = 'three' | 'p5' | 'hybrid' | 'tester';

export interface AppStore {
  visualMode: VisualMode;
  debugVisible: boolean;
  selectedPreset: string;
}

export const appStore: AppStore = {
  visualMode: 'three',
  debugVisible: true,
  selectedPreset: 'default',
};
