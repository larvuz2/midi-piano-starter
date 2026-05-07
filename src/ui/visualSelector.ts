import { appStore, type VisualMode } from '../state/appStore';
import { examplePresets } from '../examples/examplePresets';

export function createVisualSelector(onChange: () => void): HTMLSelectElement {
  const select = document.createElement('select');
  for (const preset of examplePresets) {
    const option = document.createElement('option');
    option.value = preset.mode;
    option.textContent = `${preset.label} — ${preset.mode}`;
    select.appendChild(option);
  }
  select.value = appStore.visualMode;
  select.addEventListener('change', () => {
    appStore.visualMode = select.value as VisualMode;
    onChange();
  });
  return select;
}
