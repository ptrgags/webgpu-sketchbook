import type { Machine } from '../../webgpu/Engine.js'
import { SHADER_LIBRARY } from '../../core/ShaderLibrary.js'
import { QuadMachine, QuadUVMode, type QuadMachineSketch } from '../../machines/QuadMachine.js'
import SHADER from './midi_ochre.wgsl?url'
import type { InputSystem } from '../../input/InputSystem.js'
import { AnalogConst, DigitalConst } from '../../input/const_signal.js'
import type { AnalogSignal, DigitalSignal } from '../../input/Signal.js'

const DUMMY_NOTE = new DigitalConst(false)

export class MidiOchreSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.sdf2d]

  notes: DigitalSignal[] = []

  cc: AnalogSignal = new AnalogConst(0.0)

  configure_input(input: InputSystem) {
    this.notes = input.midi.all_pitch_signals()
    this.cc = input.midi.cc_signal(21, 0)

    input.configure_uniforms({
      // Dummy note makes it easier to handle gaps in black keys
      digital: [...this.notes, DUMMY_NOTE],
      analog: [this.cc]
    })
  }

  update(time: number) {
    this.notes.forEach((x) => x.update(time))
  }

  static make_machine(): Machine {
    return new QuadMachine(new MidiOchreSketch())
  }
}
