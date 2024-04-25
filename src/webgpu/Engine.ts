import { InputSystem } from '@/input/InputSystem'
import { BindGroup } from './BindGroup'
import { Uniform, UniformArray, UniformStruct, UniformType } from './UniformBuffer'
import { get_canvas, get_context, get_device } from './setup'

export interface Machine {
  create_resources(
    device: GPUDevice,
    canvas: HTMLCanvasElement,
    context: GPUCanvasContext,
    bind_group: BindGroup
  ): Promise<void>

  configure_input(input: InputSystem): void

  update(time: number): void

  configure_passes(
    encoder: GPUCommandEncoder,
    context: GPUCanvasContext,
    bind_group: BindGroup
  ): void
}

export class Engine {
  input: InputSystem
  machine: Machine
  u_frame: UniformStruct
  u_input: UniformStruct
  bind_group: BindGroup

  constructor(machine: Machine) {
    this.input = new InputSystem()
    this.machine = machine

    const time = new Uniform(UniformType.F32, [0.0])
    this.u_frame = new UniformStruct(0, [
      {
        name: 'time',
        value: time
      }
    ])

    const digital = new UniformArray(UniformType.VEC4U, 2, new Array(4 * 2).fill(0))
    const analog = new UniformArray(UniformType.VEC4F, 4, new Array(4 * 4).fill(0))
    this.u_input = new UniformStruct(1, [
      {
        name: 'digital',
        value: digital
      },
      {
        name: 'analog',
        value: analog
      }
    ])

    this.bind_group = new BindGroup('per_frame', [this.u_frame, this.u_input])
  }

  async main() {
    this.input.init()

    const device = await get_device()
    const canvas = get_canvas('webgpu-canvas')
    const context = get_context(canvas)

    await this.create_resources(device, canvas, context)

    this.configure_input()

    // Configure the render loop
    const start = performance.now()
    const render = () => {
      const elapsed_time = (performance.now() - start) / 1000.0

      // Update state
      this.update(device, elapsed_time)

      // Queue up compute and render passes
      const encoder = device.createCommandEncoder()
      this.configure_passes(encoder, context)
      device.queue.submit([encoder.finish()])

      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
  }

  async create_resources(device: GPUDevice, canvas: HTMLCanvasElement, context: GPUCanvasContext) {
    this.u_frame.create(device)
    this.u_input.create(device)
    this.bind_group.create(device)

    await this.machine.create_resources(device, canvas, context, this.bind_group)
  }

  configure_input() {
    this.machine.configure_input(this.input)
  }

  update(device: GPUDevice, time: number) {
    this.input.update()

    // Update the current time
    this.u_frame.get_uniform('time').value = [time]

    this.u_frame.update(device)

    this.machine.update(time)
  }

  configure_passes(encoder: GPUCommandEncoder, context: GPUCanvasContext) {
    this.machine.configure_passes(encoder, context, this.bind_group)
  }
}
