import { get_canvas, get_context, get_device } from './setup'

export interface Machine {
  create_resources(
    device: GPUDevice,
    canvas: HTMLCanvasElement,
    context: GPUCanvasContext
  ): Promise<void>

  configure_passes(encoder: GPUCommandEncoder, context: GPUCanvasContext): void
}

export class Renderer {
  machine: Machine

  constructor(machine: Machine) {
    this.machine = machine
  }

  async main() {
    const device = await get_device()
    const canvas = get_canvas('webgpu-canvas')
    const context = get_context(canvas)

    await this.create_resources(device, canvas, context)

    // Configure the render loop
    const start = performance.now()
    const render = () => {
      const elapsed_time = (performance.now() - start) / 1000.0

      // Update state that doesn't require GPU resources
      this.update(elapsed_time)

      // Queue up compute and render passes
      const encoder = device.createCommandEncoder()
      this.configure_passes(encoder, context)
      device.queue.submit([encoder.finish()])

      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
  }

  async create_resources(device: GPUDevice, canvas: HTMLCanvasElement, context: GPUCanvasContext) {
    await this.machine.create_resources(device, canvas, context)
  }

  update(elapsed_time: number) {}

  configure_passes(encoder: GPUCommandEncoder, context: GPUCanvasContext) {
    this.machine.configure_passes(encoder, context)
  }
}
