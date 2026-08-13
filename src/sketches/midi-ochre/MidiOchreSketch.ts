import type { Machine } from '../../webgpu/Engine.js'
import { SHADER_LIBRARY } from '../../core/ShaderLibrary.js'
import { QuadMachine, QuadUVMode, type QuadMachineSketch } from '../../machines/QuadMachine.js'
import SHADER from './midi_ochre.wgsl?url'
import type { InputSystem } from '../../input/InputSystem.js'
import { DigitalConst } from '../../input/const_signal.js'
import type { DigitalSignal } from '../../input/Signal.js'

const DUMMY_NOTE = new DigitalConst(false)

export class MidiOchreSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.sdf2d, SHADER_LIBRARY.rect_mask]

  notes: DigitalSignal[] = []

  configure_input(input: InputSystem) {
    this.notes = input.midi.all_pitch_signals()

    input.configure_uniforms({
      // Dummy note makes it easier to handle gaps in black keys
      digital: [...this.notes, DUMMY_NOTE]
    })
  }

  update(time: number) {
    this.notes.forEach((x) => x.update(time))
  }

  static make_machine(): Machine {
    return new QuadMachine(new MidiOchreSketch())
  }
}
