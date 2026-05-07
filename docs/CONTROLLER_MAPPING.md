# Controller Mapping

Mappings live in `src/midi/midiMappings.ts`. They translate controller-specific notes and CC numbers into semantic targets.

Example targets include `controls.knob1`, `particles.size`, `scene.colorShift`, `scene.cameraDistance`, and `scene.triggerBurst`.

The `MidiLearn` prototype captures the next compatible event and returns a mapping that can be saved to localStorage.
