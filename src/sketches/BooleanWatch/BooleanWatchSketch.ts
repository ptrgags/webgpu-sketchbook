import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import SHADER from './boolean_watch.wgsl?url'
import type { InputSystem } from '@/input/InputSystem.js'
import { ObserverSignal, type AnalogSignal } from '@/input/Signal.js'
import { mod } from '@/core/mod.js'

export class BooleanWatchSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.constants, SHADER_LIBRARY.sdf2d]

  hour_angle: number = 0
  minute_angle: number = 0
  second_angle: number = 0

  hour_hand: AnalogSignal = new ObserverSignal(() => this.hour_angle)
  minute_hand: AnalogSignal = new ObserverSignal(() => this.minute_angle)
  second_hand: AnalogSignal = new ObserverSignal(() => this.second_angle)

  configure_input(input: InputSystem) {
    input.configure_uniforms({
      analog: [this.hour_hand, this.minute_hand, this.second_hand]
    })
  }

  update(time: number) {
    const now = new Date()
    const hour = now.getHours()
    const min = now.getMinutes()
    const sec = now.getSeconds()

    this.hour_angle = (mod(hour, 12) * 2.0 * Math.PI) / 12
    this.minute_angle = (mod(min, 60) * 2.0 * Math.PI) / 60
    this.second_angle = (mod(sec, 60) * 2.0 * Math.PI) / 60
  }
}
