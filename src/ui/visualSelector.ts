import { appStore, type VisualMode } from '../state/appStore';
import { examplePresets } from '../examples/examplePresets';

export function createVisualSelector(onChange: () => void): HTMLSelectElement {
  const select = document.createElement('select');
  for (const preset of examplePresets) {
    const option = document.createElement('option');
    option.value = preset.id;
    option.textContent = preset.label;
    option.title = preset.description;
    select.appendChild(option);
  }
  select.value = appStore.visualMode;
  select.addEventListener('change', () => {
    appStore.visualMode = select.value as VisualMode;
    appStore.selectedPreset = select.value;
    onChange();
  });
  return select;
}
