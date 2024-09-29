import { ObserverSignal, type AnalogSignal, type DigitalSignal } from './Signal'

export enum PitchClass {
  C = 0,
  D = 1,
  E = 2,
  F = 3,
  G = 4,
  A = 5,
  B = 6
}

export class MidiInput {
  gate: Map<number, boolean> = new Map()
  velocity: Map<number, number> = new Map()
  cc: Map<number, number> = new Map()

  init() {
    if (isSecureContext) {
      navigator.requestMIDIAccess().then((access) => {
        const inputs = access.inputs.values()
        for (const input of inputs) {
          input.onmidimessage = (msg) => {
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
        }
      }, console.error)
    }
  }

  gate_signal(midi_note: number): DigitalSignal {
    return new ObserverSignal(() => {
      return this.gate.get(midi_note) ?? false
    })
  }

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

  cc_signal(controller: number, start_value: number): AnalogSignal {
    return new ObserverSignal(() => {
      return this.cc.get(controller) ?? start_value
    })
  }
}
