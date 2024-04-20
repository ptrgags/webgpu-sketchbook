import { get_canvas, get_context, get_device } from './setup'

export class Renderer {
  async main() {
    const device = await get_device()
    const canvas = get_canvas('webgpu-canvas')
    const context = get_context(canvas)

    await this.create(device, canvas, context)

    // Configure the render loop
    const start = performance.now()
    const render = () => {
      const elapsed_time = (performance.now() - start) / 1000.0

      // Update state that doesn't require GPU resources
      this.update(elapsed_time)

      // Queue up compute and render passes
      const encoder = device.createCommandEncoder()
      this.configure_passes(encoder)
      device.queue.submit([encoder.finish()])

      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
  }

  async create(device: GPUDevice, canvas: HTMLCanvasElement, context: GPUCanvasContext) {}
  update(elapsed_time: number) {}
  configure_passes(encoder: GPUCommandEncoder) {}
}
