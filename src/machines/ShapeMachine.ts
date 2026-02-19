import { fetch_text } from '@/core/fetch_text.js'
import { MACHINE_LIBRARY, type LazyShader } from '@/core/ShaderLibrary.js'
import type { InputSystem } from '@/input/InputSystem.js'
import type { BindGroup } from '@/webgpu/BindGroup.js'
import { compile_shader } from '@/webgpu/compile_shader.js'
import type { Machine } from '@/webgpu/Engine.js'
import { IndexBuffer } from '@/webgpu/IndexBuffer.js'
import { RenderPipeline } from '@/webgpu/RenderPipeline.js'
import { VertexAttribute, VertexBuffer } from '@/webgpu/VertexBuffer.js'

export interface ShapeGeometry {
  positions: VertexAttribute
  normals: VertexAttribute
  uvs: VertexAttribute
  indices: number[]
}

export interface ShapeMachineSketch {
  shader_url: string
  imports?: LazyShader[]
  geometry: ShapeGeometry

  configure_input?: (input: InputSystem) => void
  update?: (time: number) => void
}

export class ShapeMachine implements Machine {
  private sketch: ShapeMachineSketch
  private vertex_buffer: VertexBuffer
  private index_buffer: IndexBuffer
  private render_pipeline: RenderPipeline

  constructor(sketch: ShapeMachineSketch) {
    this.sketch = sketch

    this.render_pipeline = new RenderPipeline()

    const geometry = sketch.geometry
    this.vertex_buffer = new VertexBuffer('shape_vertices', [
      geometry.positions,
      geometry.normals,
      geometry.uvs
    ])
    this.index_buffer = new IndexBuffer('shape_indices', geometry.indices)
  }

  async create_resources(
    device: GPUDevice,
    canvas: HTMLCanvasElement,
    context: GPUCanvasContext,
    bind_group: BindGroup
  ): Promise<void> {
    context.configure({
      device,
      alphaMode: 'opaque',
      format: 'bgra8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    })

    this.vertex_buffer.create(device)
    this.index_buffer.create(device)

    const imports = this.sketch.imports ?? []
    const import_promises = imports.map((x) => x.fetch_wgsl())
    const shader_module = await compile_shader(device, [
      MACHINE_LIBRARY.shape.fetch_wgsl(),
      ...import_promises,
      fetch_text(this.sketch.shader_url)
    ])

    const vertex_state: GPUVertexState = {
      module: shader_module,
      entryPoint: 'vertex_main',
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

  configure_input(input: InputSystem): void {
    if (!this.sketch.configure_input) {
      return
    }
    this.sketch.configure_input(input)
  }

  update(time: number): void {
    if (!this.sketch.update) {
      return
    }

    this.sketch.update(time)
  }

  configure_passes(
    encoder: GPUCommandEncoder,
    context: GPUCanvasContext,
    bind_group: BindGroup
  ): void {
    this.render_pipeline.render(encoder, context, bind_group, (pass) => {
      this.vertex_buffer.attach(pass)
      this.index_buffer.attach(pass)
      pass.drawIndexed(this.index_buffer.count)
    })
  }
}
