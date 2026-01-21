import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'
import { AnalogConst, DigitalConst } from '@/input/const_signal.js'
import type { InputSystem } from '@/input/InputSystem.js'
import { ReleaseSignal } from '@/input/ReleaseSignal.js'
import { ObserverSignal, type AnalogSignal, type DigitalSignal } from '@/input/Signal.js'
import { TwoButtonAxis } from '@/input/TwoButtonAxis.js'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import BOOLEAN_COLOR_SHADER from '@/shaders/boolean_color.wgsl?url'

const BOOLEAN_COUNT = 16
const PALETTE_COUNT = 4

/**
 * Because JavaScript uses trunc-based modulo, not floor based.
 * @param x value
 * @param n modulus
 * @returns x mod n
 */
function mod(x: number, n: number) {
  return ((x % n) + n) % n
}

export class BooleanColorSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = BOOLEAN_COLOR_SHADER
  imports = [SHADER_LIBRARY.sdf2d, SHADER_LIBRARY.srgb, SHADER_LIBRARY.oklch]
  palette_a: number = 0
  palette_b: number = 0
  boolean_op: number = 0
  z_key: DigitalSignal = new DigitalConst(false)
  x_key: DigitalSignal = new DigitalConst(false)
  increment: AnalogSignal = new AnalogConst(0)

  configure_input(input: InputSystem) {
    this.z_key = input.keyboard.digital_key('KeyZ')
    this.x_key = input.keyboard.digital_key('KeyX')

    const up_arrow = input.keyboard.digital_key('ArrowUp')
    const down_arrow = input.keyboard.digital_key('ArrowDown')
    const up_released = new ReleaseSignal(up_arrow)
    const down_released = new ReleaseSignal(down_arrow)
    this.increment = new TwoButtonAxis(down_released, up_released)

    const palette_a = new ObserverSignal(() => {
      return this.palette_a
    })

    const palette_b = new ObserverSignal(() => {
      return this.palette_b
    })

    const boolean_op = new ObserverSignal(() => {
      return this.boolean_op
    })

    input.configure_uniforms({
      analog: [palette_a, palette_b, boolean_op]
    })
  }

  update(time: number) {
    this.increment.update(time)

    if (this.z_key.value) {
      this.palette_a += this.increment.value
      this.palette_a = mod(this.palette_a, PALETTE_COUNT)
    } else if (this.x_key.value) {
      this.palette_b += this.increment.value
      this.palette_b = mod(this.palette_b, PALETTE_COUNT)
    } else {
      this.boolean_op += this.increment.value
      this.boolean_op = mod(this.boolean_op, BOOLEAN_COUNT)
    }
  }
}
