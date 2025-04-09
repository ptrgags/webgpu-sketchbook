import { ObserverSignal, type AnalogSignal, type DigitalSignal } from './Signal'

export enum PitchClass {
  C = 0,
  Cs = 1,
  D = 2,
  Ds = 3,
  E = 4,
  F = 5,
  Fs = 6,
  G = 7,
  Gs = 8,
  A = 9,
  As = 10,
  B = 11
}

export class MidiInput {
  gate: Map<number, boolean> = new Map()
  velocity: Map<number, number> = new Map()
  cc: Map<number, number> = new Map()

  /**
   * Init is a no-op for this input system. You must explicitly call
   * request_midi() to set up midi input given the browser permission prompt
   */
  init() {}

  request_midi() {
    if (!isSecureContext) {
      return;
    }

    navigator.requestMIDIAccess().then((access) => {
      const inputs = access.inputs.values()
      for (const input of inputs) {
        input.onmidimessage = (msg) => {
          this.handle_message(msg);
        }
      }
    }, console.error)
  }

  handle_message(msg: MIDIMessageEvent) {
    if (!msg.data) {
      return
    }
    const status_byte = msg.data[0]
    const is_note_off = status_byte >> 4 === 0b1000
    const is_note_on = status_byte >> 4 === 0b1001
    const is_cc = status_byte >> 4 === 0b1011

    if (is_note_off) {
      const note = msg.data[1]
      this.gate.set(note, false)
      this.velocity.set(note, 0)
    } else if (is_note_on) {
      const note = msg.data[1]
      const velocity = msg.data[2]
      // Some MIDI controllers send "on with velocity 0" to mean note off...
      const is_pressed = velocity > 0

      this.gate.set(note, is_pressed)
      this.velocity.set(note, is_pressed ? velocity : 0)
    } else if (is_cc) {
      const controller = msg.data[1]
      const value = msg.data[2]
      this.cc.set(controller, value)
    }
    // Ignore anything else
  }

  /**
   * Get a signal that is true when a note is on, and false when a note is
   * off.
   * @param midi_note The note number in [0, 127]
   * @returns A gate signal for that note
   */
  gate_signal(midi_note: number): DigitalSignal {
    return new ObserverSignal(() => {
      return this.gate.get(midi_note) ?? false
    })
  }

  /**
   * Get a gate signal for any note of a given pitch, regardless of octaves.
   * @param pitch One of the 12 pitch classes
   * @returns  A digital gate signal
   */
  pitch_signal(pitch: PitchClass): DigitalSignal {
    return new ObserverSignal(() => {
      const MIDI_NOTE_COUNT = 128
      const OCTAVE = 12
      for (let i = pitch; i < MIDI_NOTE_COUNT; i += OCTAVE) {
        if (this.gate.get(i)) {
          return true
        }
      }

      return false
    })
  }

  /**
   * Get a MIDI control signal (e.g. a slider/knob/button value) 
   * This only supports single-byte values at preset.
   * @param controller The controller number in [0, 127]
   * @param start_value The assumed initial value of the signal from [0, 127]
   * since MIDI does not provide a way to query this
   * @returns an analog signal representing the current state of the MIDI CC
   */
  cc_signal(controller: number, start_value: number): AnalogSignal {
    return new ObserverSignal(() => {
      return this.cc.get(controller) ?? start_value
    })
  }
}
