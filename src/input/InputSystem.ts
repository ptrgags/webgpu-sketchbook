import { GamepadInput } from './GamepadInput'

export class InputSystem {
  // midi
  gamepad: GamepadInput
  // keyboard
  // mouse

  constructor() {
    this.gamepad = new GamepadInput()
  }

  init() {
    this.gamepad.init()
  }

  update() {
    this.gamepad.update()
  }
}
