# Shader Visual Alternatives

The starter includes three fullscreen p5 WebGL shader approaches inspired by the supplied `loadShader`, `resolution`, `time`, and full-window `WEBGL` technique.

## 1. Shader Defense Dance

A radial, defensive pattern system with kaleidoscopic arms, pulsing rings, edge blades, and note-triggered glow. It is best for sharp rhythmic piano gestures and pad bursts.

## 2. Shader Organism Field

A biological field of cellular membranes and vein-like patterning. MIDI note velocity energizes the membranes while repetition and morph controls alter cell density and internal drift.

## 3. Shader Cathedral Glass

An architectural stained-glass composition with arches, columns, and color windows. It works well for slower melodic playing and dramatic palette shifts.

## Real-time controls

The sidebar exposes shader sliders for distortion, symmetry, repetition, morph, bloom, line weight, and feedback. It also includes shared scene/particle controls and virtual knobs so visuals can be performed without a controller attached.

Color palettes live in `src/state/palettes.ts`, and every shader sketch reads the selected palette on each frame.
