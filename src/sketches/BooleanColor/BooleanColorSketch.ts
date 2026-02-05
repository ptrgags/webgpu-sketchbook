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
import SHADER from './boolean_color.wgsl?url'

const BOOLEAN_COUNT = 16
const PALETTE_COUNT = 28
const MAX_BITS = 8

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

interface ButtonLayout {
  a_button: DigitalSignal
  b_button: DigitalSignal
  x_button: DigitalSignal
  y_button: DigitalSignal
  up_button: DigitalSignal
  down_button: DigitalSignal
}

interface VirtualCounter {
  increment: DigitalSignal
  decrement: DigitalSignal
}

type Modifier = 'a_button' | 'b_button' | 'x_button' | 'y_button'

/**
 * Make a signal that's +1 when a counter should increment, -1 when a counter
 * should decrement, and
 * @param modifier_id Which button to use as the modifier for gamepad/keyboard
 * @param gamepad Gamepad buttons
 * @param keyboard Keyboard buttons
 * @param virtual_counter Pair of virtual buttons for pointer input
 * @returns A signal representing
 */
function make_delta_signal(
  modifier_id: Modifier,
  gamepad: ButtonLayout,
  keyboard: ButtonLayout,
  virtual_counter: VirtualCounter
): TwoButtonAxis {
  const decrement = new ReleaseSignal(
    new DigitalCascade([
      modify(gamepad[modifier_id], gamepad.down_button),
      modify(keyboard[modifier_id], keyboard.down_button),
      virtual_counter.decrement
    ])
  )

  const increment = new ReleaseSignal(
    new DigitalCascade([
      modify(gamepad[modifier_id], gamepad.up_button),
      modify(keyboard[modifier_id], keyboard.up_button),
      virtual_counter.increment
    ])
  )
  return new TwoButtonAxis(decrement, increment)
}

export class BooleanColorSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.sdf2d,
    SHADER_LIBRARY.srgb,
    SHADER_LIBRARY.oklch,
    SHADER_LIBRARY.rect_mask
  ]

  // Uniform values
  palette_a: number = 0
  palette_b: number = 0
  // start with an interesting operator, AND
  // See constants in the shader
  boolean_op: number = 1
  bit_depth: number = 3

  // these pulse 1.0 when the uniform should be incremented (mod n)
  // and -1.0 when the uniform should be decremented
  palette_a_delta: AnalogSignal = new AnalogConst(0.0)
  palette_b_delta: AnalogSignal = new AnalogConst(0.0)
  operator_delta: AnalogSignal = new AnalogConst(0.0)
  bit_depth_delta: AnalogSignal = new AnalogConst(0.0)

  configure_input(input: InputSystem) {
    const keyboard_buttons: ButtonLayout = {
      a_button: input.keyboard.digital_key('KeyZ'),
      b_button: input.keyboard.digital_key('KeyX'),
      x_button: input.keyboard.digital_key('KeyA'),
      y_button: input.keyboard.digital_key('KeyS'),
      up_button: input.keyboard.digital_key('ArrowUp'),
      down_button: input.keyboard.digital_key('ArrowDown')
    }

    const gamepad_buttons: ButtonLayout = {
      a_button: input.gamepad.digital_button(GamepadButtons.A),
      b_button: input.gamepad.digital_button(GamepadButtons.B),
      x_button: input.gamepad.digital_button(GamepadButtons.X),
      y_button: input.gamepad.digital_button(GamepadButtons.Y),
      up_button: input.gamepad.digital_button(GamepadButtons.Up),
      down_button: input.gamepad.digital_button(GamepadButtons.Down)
    }

    // Pointer input works differently. There's a pair of increment/decrement
    // buttons for each uniform
    const vb_palette_a = {
      decrement: input.pointer.virtual_button(
        new Vec2(0, GRID_Y + SQUARE_SIZE.y),
        new Vec2(SQUARE_SIZE.x, 8 * SQUARE_SIZE.y)
      ),
      increment: input.pointer.virtual_button(
        new Vec2(0, GRID_Y + 9 * SQUARE_SIZE.y),
        new Vec2(SQUARE_SIZE.x, 8 * SQUARE_SIZE.y)
      )
    }
    const vb_palette_b = {
      decrement: input.pointer.virtual_button(
        new Vec2(SQUARE_SIZE.x, GRID_Y),
        new Vec2(8 * SQUARE_SIZE.x, SQUARE_SIZE.y)
      ),
      increment: input.pointer.virtual_button(
        new Vec2(9 * SQUARE_SIZE.x, GRID_Y),
        new Vec2(8 * SQUARE_SIZE.x, SQUARE_SIZE.y)
      )
    }
    const vb_operator = {
      decrement: input.pointer.virtual_button(
        new Vec2(150 * PIXEL.x, 0),
        new Vec2(100 * PIXEL.x, 100 * PIXEL.y)
      ),
      increment: input.pointer.virtual_button(
        new Vec2(250 * PIXEL.x, 0),
        new Vec2(100 * PIXEL.x, 100 * PIXEL.y)
      )
    }
    const vb_bit_depth = {
      increment: input.pointer.virtual_button(
        new Vec2(0, 600 * PIXEL.y),
        new Vec2(250 * PIXEL.x, 100 * PIXEL.y)
      ),
      decrement: input.pointer.virtual_button(
        new Vec2(250 * PIXEL.x, 600 * PIXEL.y),
        new Vec2(250 * PIXEL.x, 100 * PIXEL.y)
      )
    }

    this.palette_a_delta = make_delta_signal(
      'a_button',
      gamepad_buttons,
      keyboard_buttons,
      vb_palette_a
    )
    this.palette_b_delta = make_delta_signal(
      'b_button',
      gamepad_buttons,
      keyboard_buttons,
      vb_palette_b
    )
    this.operator_delta = make_delta_signal(
      'x_button',
      gamepad_buttons,
      keyboard_buttons,
      vb_operator
    )
    this.bit_depth_delta = make_delta_signal(
      'y_button',
      gamepad_buttons,
      keyboard_buttons,
      vb_bit_depth
    )

    // Create signals for the uniforms
    const palette_a = new ObserverSignal(() => this.palette_a)
    const palette_b = new ObserverSignal(() => this.palette_b)
    const boolean_op = new ObserverSignal(() => this.boolean_op)
    const bit_depth = new ObserverSignal(() => this.bit_depth)
    input.configure_uniforms({
      analog: [palette_a, palette_b, boolean_op, bit_depth]
    })
  }

  update(time: number) {
    this.palette_a_delta.update(time)
    this.palette_b_delta.update(time)
    this.operator_delta.update(time)
    this.bit_depth_delta.update(time)

    this.palette_a += this.palette_a_delta.value
    this.palette_a = mod(this.palette_a, PALETTE_COUNT)

    this.palette_b += this.palette_b_delta.value
    this.palette_b = mod(this.palette_b, PALETTE_COUNT)

    this.boolean_op += this.operator_delta.value
    this.boolean_op = mod(this.boolean_op, BOOLEAN_COUNT)

    this.bit_depth += this.bit_depth_delta.value
    this.bit_depth = mod(this.bit_depth, MAX_BITS)
  }
}
