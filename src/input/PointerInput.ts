import { Vec2 } from '@/core/Vec2'
import { ObserverSignal, type AnalogSignal, type DigitalSignal } from './Signal'

function compute_position(canvas: HTMLCanvasElement, client_x: number, client_y: number): Vec2 {
  const bounding_rect = canvas.getBoundingClientRect()
  const x = client_x - bounding_rect.left
  const y = client_y - bounding_rect.top
  return new Vec2(x, y)
}

function clamp(x: number, a: number, b: number): number {
  return Math.min(Math.max(x, a), b)
}

export class PointerInput {
  pressed: boolean
  position: Vec2
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.pressed = false
    this.position = new Vec2(0, 0)
    this.canvas = canvas
  }

  init() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.pressed = true
      this.position = compute_position(this.canvas, e.clientX, e.clientY)
    })

    this.canvas.addEventListener('pointermove', (e) => {
      this.position = compute_position(this.canvas, e.clientX, e.clientY)
    })

    this.canvas.addEventListener('pointerup', (e) => {
      this.pressed = false
      this.position = compute_position(this.canvas, e.clientX, e.clientY)
    })
  }

  get pressed_signal(): DigitalSignal {
    return new ObserverSignal(() => {
      return this.pressed
    })
  }

  get screen_axes(): [AnalogSignal, AnalogSignal] {
    const x_axis = new ObserverSignal(() => {
      const { width } = this.canvas.getBoundingClientRect()
      const center_x = width / 2
      const scale = width / 2

      const x = this.position.x
      return clamp((x - center_x) / scale, -1, 1)
    })

    const y_axis = new ObserverSignal(() => {
      const { width, height } = this.canvas.getBoundingClientRect()
      const center_y = height / 2

      // Scale with the same units as the x-axis to ensure the pixels are
      // a 1:1 aspect ratio
      const scale = width / 2

      const y = this.position.y

      // flip result so y is up
      return -clamp((y - center_y) / scale, -1, 1)
    })

    return [x_axis, y_axis]
  }
}
