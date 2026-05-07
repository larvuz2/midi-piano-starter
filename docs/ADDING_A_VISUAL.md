# Adding a Visual

Create a visual module under `src/visuals/three` or a sketch factory under `src/visuals/p5`.

Rules:

1. Consume `VisualState`.
2. Do not subscribe to raw MIDI in a visual.
3. Dispose Three.js geometries, materials, textures, and objects.
4. Keep the module removable so the visual selector can swap modes safely.

## Adding a fullscreen shader visual

Use `src/visuals/p5/ShaderDance.ts` as the template for a full-window p5 `WEBGL` shader. Create a sketch factory that receives `VisualState`, sets uniforms such as `resolution`, `time`, MIDI energy, note velocity, shader parameters, and palette colors, then draws a full-screen rectangle every frame.
