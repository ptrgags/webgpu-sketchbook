import { MACHINE_LIBRARY, type LazyShader } from '@/core/ShaderLibrary'
import type { InputSystem } from '@/input/InputSystem'
import type { BindGroup } from '@/webgpu/BindGroup'
import type { Machine } from '@/webgpu/Engine'
import { RenderPipeline } from '@/webgpu/RenderPipeline'
import { VertexAttribute, VertexBuffer } from '@/webgpu/VertexBuffer'
import { NUM_VERTICES, QUAD_POSITIONS, UVS_CENTERED } from './QuadMachine'
import { compile_shader } from '@/webgpu/compile_shader'
import { fetch_text } from '@/core/fetch_text'
import { AnalogConst } from '@/input/const_signal'
import { ObserverSignal, type AnalogSignal } from '@/input/Signal'

const ANGLE_SPEED = Math.PI / 48.0

export interface SphereTracerSketch {
  imports?: LazyShader[]
  shader_url: string
}

/**
 * A sphere tracer is similar to QuadMachine, but with extra code for rendering
 * an SDF, and a bit more opinionated about some of the quad shader settings.
 */
export class SphereTracerMachine implements Machine {
  private sketch: SphereTracerSketch
  private vertex_buffer: VertexBuffer
  private render_pipeline: RenderPipeline

  private angle: number = 0.0
  private x_axis: AnalogSignal = new AnalogConst(0.0)

  constructor(sketch: SphereTracerSketch) {
    this.sketch = sketch
    this.render_pipeline = new RenderPipeline()

    const positions = new VertexAttribute(NUM_VERTICES, 2, QUAD_POSITIONS)
    // For sphere tracing, centered UVs are easiest for orienting the camera
    const uvs = new VertexAttribute(NUM_VERTICES, 2, UVS_CENTERED)
    this.vertex_buffer = new VertexBuffer('quad_vertices', [positions, uvs])
  }

  async create_resources(
    device: GPUDevice,
    canvas: HTMLCanvasElement,
    context: GPUCanvasContext,
    bind_group: BindGroup
  ) {
    context.configure({
      device,
      // for compositing on the page
      alphaMode: 'opaque',
      // swap chain format
      format: 'bgra8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    })

    this.vertex_buffer.create(device)

    const imports = this.sketch.imports ?? []
    const import_promises = imports.map((x) => x.fetch_wgsl())
    const shader_module = await compile_shader(device, [
      MACHINE_LIBRARY.quad.fetch_wgsl(),
      MACHINE_LIBRARY.sphere_tracer.fetch_wgsl(),
      ...import_promises,
      fetch_text(this.sketch.shader_url)
    ])

    const vertex_state: GPUVertexState = {
      module: shader_module,
      entryPoint: 'vertex_default',
      buffers: [this.vertex_buffer.buffer_layout]
    }

    const fragment_state: GPUFragmentState = {
      module: shader_module,
      entryPoint: 'fragment_main',
      targets: [
        {
          format: 'bgra8unorm'
        }
      ]
    }

    await this.render_pipeline.create(device, vertex_state, fragment_state, bind_group)
  }
  configure_input(input: InputSystem) {
    const [arrows_x, _] = input.keyboard.arrow_axes

    this.x_axis = arrows_x

    const angle_signal = new ObserverSignal(() => {
      return this.angle
    })

    input.configure_uniforms({
      analog: [angle_signal]
    })
  }

  update(time: number): void {
    this.x_axis.update(time)
    this.angle += ANGLE_SPEED * this.x_axis.value
  }

  configure_passes(
    encoder: GPUCommandEncoder,
    context: GPUCanvasContext,
    bind_group: BindGroup
  ): void {
    this.render_pipeline.render(encoder, context, bind_group, (pass) => {
      this.vertex_buffer.attach(pass)
      pass.draw(NUM_VERTICES)
    })
  }
}
