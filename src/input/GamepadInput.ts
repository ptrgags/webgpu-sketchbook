import { ObserverSignal, type AnalogSignal, type DigitalSignal } from './Signal'
import { TwoButtonAxis } from './TwoButtonAxis'

// Constants based on xinput gamepad
export enum GamepadAxes {
  LeftStickX = 0,
  LeftStickY = 1,
  RightStickX = 2,
  RightStickY = 3
}

export enum GamepadButtons {
  A = 0,
  B = 1,
  X = 2,
  Y = 3,
  LB = 4,
  RB = 5,
  LT = 6,
  RT = 7,
  // I had to look these up, they used to be called Back and Start
  View = 8,
  Menu = 9,
  LS = 10,
  RS = 11,
  Up = 12,
  Down = 13,
  Left = 14,
  Right = 15
}

const DEFAULT_DEADZONE = 0.001

export class GamepadInput {
  gamepad?: Gamepad

  init() {
    window.addEventListener('gamepadconnected', (e) => {
      if (this.gamepad) {
        throw new Error('Only one gamepad supported')
      }
      this.gamepad = e.gamepad
    })

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepad = undefined
    })
  }

  update() {
    const gamepads = navigator.getGamepads()

    // Get the first available gamepad
    for (const maybe_gamepad of gamepads) {
      if (maybe_gamepad) {
        this.gamepad = maybe_gamepad
        return
      }
    }

    this.gamepad = undefined
  }

  digital_button(button_index: number): DigitalSignal {
    return new ObserverSignal(() => {
      if (!this.gamepad) {
        return false
      }

      return this.gamepad.buttons[button_index].pressed ?? false
    })
  }

  analog_button(button_index: number): AnalogSignal {
    return new ObserverSignal(() => {
      if (!this.gamepad) {
        return 0.0
      }

      return this.gamepad.buttons[button_index].value ?? 0.0
    })
  }

  axis(axis_index: number, flip: boolean, deadzone: number): AnalogSignal {
    return new ObserverSignal(() => {
      if (!this.gamepad) {
        return 0.0
      }

      let val = this.gamepad.axes[axis_index] ?? 0.0

      // Handle dead zone
      if (Math.abs(val) < deadzone) {
        val = 0.0
      }

      return flip ? -val : val
    })
  }

  /**
   * Get the two axes for the left stick, with the y axis flipped so y is up
   */
  get left_stick(): [AnalogSignal, AnalogSignal] {
    return [
      this.axis(GamepadAxes.LeftStickX, false, DEFAULT_DEADZONE),
      this.axis(GamepadAxes.LeftStickY, true, DEFAULT_DEADZONE)
    ]
  }

  /**
   * Get the two axes for the right stick, with the y axis flipped so y is up
   */
  get right_stick(): [AnalogSignal, AnalogSignal] {
    return [
      this.axis(GamepadAxes.RightStickX, false, DEFAULT_DEADZONE),
      this.axis(GamepadAxes.RightStickY, true, DEFAULT_DEADZONE)
    ]
  }

  /**
   * Turn the 4 D-pad buttons into an X and Y axis (with Y pointing up)
   */
  get dpad_axes(): [AnalogSignal, AnalogSignal] {
    return [
      new TwoButtonAxis(
        this.digital_button(GamepadButtons.Left),
        this.digital_button(GamepadButtons.Right)
      ),
      new TwoButtonAxis(
        this.digital_button(GamepadButtons.Down),
        this.digital_button(GamepadButtons.Up)
      )
    ]
  }
}
