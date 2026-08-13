import type { Machine } from '../../webgpu/Engine.js'
import { SHADER_LIBRARY } from '../../core/ShaderLibrary.js'
import { QuadMachine, QuadUVMode, type QuadMachineSketch } from '../../machines/QuadMachine.js'
import SHADER from './midi_ochre.wgsl?url'

export class MidiOchreSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.sdf2d]

  static make_machine(): Machine {
    return new QuadMachine(new MidiOchreSketch())
  }
}
