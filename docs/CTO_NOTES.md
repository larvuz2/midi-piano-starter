# CTO Notes

This starter prioritizes reliable architecture over a single polished visual. The first milestone is MIDI access, parsing, device testing, and normalized state. Visual engines then consume that state through clean module interfaces.

The MIDI controller is intentionally not hardcoded into visuals. Raw MIDI data is parsed once, mapped through a reusable layer, stored in shared visual state, and then read by Three.js and p5.js modules.
