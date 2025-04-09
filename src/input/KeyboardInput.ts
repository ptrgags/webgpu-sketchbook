import { ObserverSignal, type AnalogSignal, type DigitalSignal } from './Signal'
import { TwoButtonAxis } from './TwoButtonAxis'

const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']

export class KeyboardInput {
  keysPressed: Map<string, boolean>

  constructor() {
    this.keysPressed = new Map()
  }

  init() {
    window.addEventListener('keydown', (e) => {
      this.keysPressed.set(e.code, true)
      if (ARROW_KEYS.includes(e.code)) {
        e.preventDefault()
      }
    })

    window.addEventListener('keyup', (e) => {
      this.keysPressed.set(e.code, false)
      if (ARROW_KEYS.includes(e.code)) {
        e.preventDefault()
      }
    })
  }

  digital_key(code: string): DigitalSignal {
    return new ObserverSignal(() => {
      return this.keysPressed.get(code) ?? false
    })
  }

  get arrow_axes(): [AnalogSignal, AnalogSignal] {
    return [
      new TwoButtonAxis(this.digital_key('ArrowLeft'), this.digital_key('ArrowRight')),
      new TwoButtonAxis(this.digital_key('ArrowDown'), this.digital_key('ArrowUp'))
    ]
  }

  get wasd_axes(): [AnalogSignal, AnalogSignal] {
    return [
      new TwoButtonAxis(this.digital_key('KeyA'), this.digital_key('KeyD')),
      new TwoButtonAxis(this.digital_key('KeyS'), this.digital_key('KeyW'))
    ]
  }
}
