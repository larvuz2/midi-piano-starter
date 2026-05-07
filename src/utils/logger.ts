export const logger = {
  info: (...args: unknown[]) => console.info('[midi-web-visuals]', ...args),
  warn: (...args: unknown[]) => console.warn('[midi-web-visuals]', ...args),
  error: (...args: unknown[]) => console.error('[midi-web-visuals]', ...args),
};
