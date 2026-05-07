export type RafCallback = (delta: number, elapsed: number) => void;

export class RafLoop {
  private frameId = 0;
  private last = 0;
  private elapsed = 0;

  constructor(private readonly callback: RafCallback) {}

  start(): void {
    this.stop();
    this.last = performance.now();
    const tick = (now: number) => {
      const delta = (now - this.last) / 1000;
      this.last = now;
      this.elapsed += delta;
      this.callback(delta, this.elapsed);
      this.frameId = window.requestAnimationFrame(tick);
    };
    this.frameId = window.requestAnimationFrame(tick);
  }

  stop(): void {
    if (this.frameId) window.cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }
}
