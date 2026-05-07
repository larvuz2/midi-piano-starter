# MIDI Guide

The app uses the browser-native Web MIDI API through `navigator.requestMIDIAccess({ sysex: false })`. MIDI access is requested only after the user clicks **Connect MIDI Device**, which keeps the app compatible with modern permission prompts.

Incoming `midimessage` data is decoded in `src/midi/midiParser.ts` and supports note on, note off, control change, pitch bend, program change, and aftertouch. Continuous values are normalized before they reach visuals.
