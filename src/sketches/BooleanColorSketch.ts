import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'
import { Vec2 } from '@/core/Vec2.js'
import { DigitalCascade } from '@/input/CascadeSignal.js'
import { AnalogConst } from '@/input/const_signal.js'
import { GamepadButtons } from '@/input/GamepadInput.js'
import type { InputSystem } from '@/input/InputSystem.js'
import { ReleaseSignal } from '@/input/ReleaseSignal.js'
import { ObserverSignal, type AnalogSignal, type DigitalSignal } from '@/input/Signal.js'
import { TwoButtonAxis } from '@/input/TwoButtonAxis.js'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import BOOLEAN_COLOR_SHADER from '@/shaders/boolean_color.wgsl?url'

const BOOLEAN_COUNT = 16
const PALETTE_COUNT = 28

/**
 * Because JavaScript uses trunc-based modulo, not floor based.
 * @param x value
 * @param n modulus
 * @returns x mod n
 */
function mod(x: number, n: number) {
  return ((x % n) + n) % n
}

// I'm used to working with 500x700 px images, this is one pixel
// in UV coordinates
const PIXEL = new Vec2(1 / 500, 1 / 700)

// The grid starts at 100 px down the canvas
// It's initially a 16x16 px grid with 1 extra row and column
const GRID_Y = 100 * PIXEL.y
const ASPECT_RATIO = 5 / 7
const SQUARE_SIZE = new Vec2(1 / 17, ASPECT_RATIO / 17)

function modify(modifier: DigitalSignal, button: DigitalSignal): DigitalSignal {
  return new ObserverSignal(() => {
    return modifier.value && button.value
  })
}

function no_modifiers(
  mod_a: DigitalSignal,
  mod_b: DigitalSignal,
  button: DigitalSignal
): DigitalSignal {
  return new ObserverSignal(() => {
    return !mod_a.value && !mod_b.value && button.value
  })
}

export class BooleanColorSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = BOOLEAN_COLOR_SHADER
  imports = [SHADER_LIBRARY.sdf2d, SHADER_LIBRARY.srgb, SHADER_LIBRARY.oklch]

  // Uniform values
  palette_a: number = 0
  palette_b: number = 0
  // start with an interesting operator, AND
  // See constants in the shader
  boolean_op: number = 1

  // these pulse 1.0 when the uniform should be incremented (mod n)
  // and -1.0 when the uniform should be decremented
  palette_a_delta: AnalogSignal = new AnalogConst(0.0)
  palette_b_delta: AnalogSignal = new AnalogConst(0.0)
  op_delta: AnalogSignal = new AnalogConst(0.0)

  configure_input(input: InputSystem) {
    // keyboard input
    const key_z = input.keyboard.digital_key('KeyZ')
    const key_x = input.keyboard.digital_key('KeyX')
    const arrow_up = input.keyboard.digital_key('ArrowUp')
    const arrow_down = input.keyboard.digital_key('ArrowDown')

    // gamepad input
    const gamepad_a = input.gamepad.digital_button(GamepadButtons.A)
    const gamepad_b = input.gamepad.digital_button(GamepadButtons.B)
    const dpad_up = input.gamepad.digital_button(GamepadButtons.Up)
    const dpad_down = input.gamepad.digital_button(GamepadButtons.Down)

    // pointer input

    const vb_palette_a_decrement = input.pointer.virtual_button(
      new Vec2(0, GRID_Y + SQUARE_SIZE.y),
      new Vec2(SQUARE_SIZE.x, 8 * SQUARE_SIZE.y)
    )
    const vb_palette_a_increment = input.pointer.virtual_button(
      new Vec2(0, GRID_Y + 9 * SQUARE_SIZE.y),
      new Vec2(SQUARE_SIZE.x, 8 * SQUARE_SIZE.y)
    )
    const vb_palette_b_decrement = input.pointer.virtual_button(
      new Vec2(SQUARE_SIZE.x, GRID_Y),
      new Vec2(8 * SQUARE_SIZE.x, SQUARE_SIZE.y)
    )
    const vb_palette_b_increment = input.pointer.virtual_button(
      new Vec2(9 * SQUARE_SIZE.x, GRID_Y),
      new Vec2(8 * SQUARE_SIZE.x, SQUARE_SIZE.y)
    )
    const vb_op_decrement = input.pointer.virtual_button(
      new Vec2(150 * PIXEL.x, 0),
      new Vec2(100 * PIXEL.x, 100 * PIXEL.y)
    )
    const vb_op_increment = input.pointer.virtual_button(
      new Vec2(250 * PIXEL.x, 0),
      new Vec2(100 * PIXEL.x, 100 * PIXEL.y)
    )

    // Merge the inputs, with priority Gamepad > Keyboard > Pointer
    const palette_a_increment = new ReleaseSignal(
      new DigitalCascade([
        modify(gamepad_a, dpad_up),
        modify(key_z, arrow_up),
        vb_palette_a_increment
      ])
    )
    const palette_a_decrement = new ReleaseSignal(
      new DigitalCascade([
        modify(gamepad_a, dpad_down),
        modify(key_z, arrow_down),
        vb_palette_a_decrement
      ])
    )
    const palette_b_increment = new ReleaseSignal(
      new DigitalCascade([
        modify(gamepad_b, dpad_up),
        modify(key_x, arrow_up),
        vb_palette_b_increment
      ])
    )
    const palette_b_decrement = new ReleaseSignal(
      new DigitalCascade([
        modify(gamepad_b, dpad_down),
        modify(key_x, arrow_down),
        vb_palette_b_decrement
      ])
    )
    const op_increment = new ReleaseSignal(
      new DigitalCascade([
        no_modifiers(gamepad_a, gamepad_b, dpad_up),
        no_modifiers(key_z, key_x, arrow_up),
        vb_op_increment
      ])
    )
    const op_decrement = new ReleaseSignal(
      new DigitalCascade([
        no_modifiers(gamepad_a, gamepad_b, dpad_down),
        no_modifiers(key_z, key_x, arrow_down),
        vb_op_decrement
      ])
    )

    // finally, let's combine the increment/decrement pairs
    // into a digital axis so the value is either -1.0 or 1.0
    // when the button is released
    this.palette_a_delta = new TwoButtonAxis(palette_a_decrement, palette_a_increment)
    this.palette_b_delta = new TwoButtonAxis(palette_b_decrement, palette_b_increment)
    this.op_delta = new TwoButtonAxis(op_decrement, op_increment)

    // Create signals for the uniforms
    const palette_a = new ObserverSignal(() => this.palette_a)
    const palette_b = new ObserverSignal(() => this.palette_b)
    const boolean_op = new ObserverSignal(() => this.boolean_op)
    input.configure_uniforms({
      analog: [palette_a, palette_b, boolean_op]
    })
  }

  update(time: number) {
    this.palette_a_delta.update(time)
    this.palette_b_delta.update(time)
    this.op_delta.update(time)

    this.palette_a += this.palette_a_delta.value
    this.palette_a = mod(this.palette_a, PALETTE_COUNT)

    this.palette_b += this.palette_b_delta.value
    this.palette_b = mod(this.palette_b, PALETTE_COUNT)

    this.boolean_op += this.op_delta.value
    this.boolean_op = mod(this.boolean_op, BOOLEAN_COUNT)
  }
}
