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

  digital_button(button_index: number): boolean {
    if (!this.gamepad) {
      return false
    }

    return this.gamepad.buttons[button_index].pressed ?? false
  }

  analog_button(button_index: number): number {
    if (!this.gamepad) {
      return 0.0
    }

    return this.gamepad.buttons[button_index].value ?? 0.0
  }

  axis(axis_index: number): number {
    if (!this.gamepad) {
      return 0.0
    }

    return this.gamepad.axes[axis_index] ?? 0.0
  }
}
