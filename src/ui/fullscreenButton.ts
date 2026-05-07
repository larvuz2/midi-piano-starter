export function createFullscreenButton(target: HTMLElement): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = 'Fullscreen Canvas';
  button.addEventListener('click', async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      button.textContent = 'Fullscreen Canvas';
      return;
    }
    await target.requestFullscreen();
    button.textContent = 'Exit Fullscreen';
  });
  document.addEventListener('fullscreenchange', () => {
    button.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen Canvas';
  });
  return button;
}
