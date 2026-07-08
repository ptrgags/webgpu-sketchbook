import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import SHADER from './boolean_watch.wgsl?url'
import type { InputSystem } from '@/input/InputSystem.js'

export class BooleanWatchSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.constants, SHADER_LIBRARY.sdf2d, SHADER_LIBRARY.bitwise_color]

  configure_input(input: InputSystem) {
    input.configure_uniforms({
      analog: [input.clock.hour_hand, input.clock.minute_hand, input.clock.second_hand]
    })
  }
}
