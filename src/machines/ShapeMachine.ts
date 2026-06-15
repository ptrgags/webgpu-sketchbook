import { fetch_text } from '@/core/fetch_text.js'
import { MACHINE_LIBRARY, type LazyShader } from '@/core/ShaderLibrary.js'
import type { InputSystem } from '@/input/InputSystem.js'
import type { BindGroup } from '@/webgpu/BindGroup.js'
import { compile_shader } from '@/webgpu/compile_shader.js'
import type { Machine } from '@/webgpu/Engine.js'
import { IndexBuffer } from '@/webgpu/IndexBuffer.js'
import { RenderPipeline } from '@/webgpu/RenderPipeline.js'
import { VertexBuffer } from '@/webgpu/VertexBuffer.js'
import type { Mesh } from '@/meshes/Mesh.js'
import { mod } from '@/core/mod.js'

export interface ShapeMachineSketch {
  shader_url: string
  imports?: LazyShader[]
  meshes: Mesh[]

  configure_input?: (input: InputSystem) => void
  update?: (time: number) => void
}

interface Model {
  label: string
  vertex_buffer: VertexBuffer
  index_buffer: IndexBuffer
}

export class ShapeMachine implements Machine {
  private sketch: ShapeMachineSketch
  private models: Model[]
  private current_model: number = 0
  private render_pipeline: RenderPipeline

  constructor(sketch: ShapeMachineSketch) {
    this.sketch = sketch

    this.render_pipeline = new RenderPipeline()

    if (sketch.meshes.length === 0) {
      throw new Error('there must be at least one mesh')
    }

    this.models = sketch.meshes.map((mesh) => {
      const vertex_buffer = new VertexBuffer(`${mesh.label}_vertices`, [
        mesh.positions,
        mesh.normals,
        mesh.uvs
      ])
      const index_buffer = new IndexBuffer(`${mesh.label}_indices`, mesh.indices)
      return {
        label: mesh.label,
        vertex_buffer,
        index_buffer
      }
    })
  }

  /**
   * Advance to a new models
   * @param places Number of places to advance the cyclical list of models
   */
  cycle_model(places: number) {
    this.current_model = mod(this.current_model + places, this.models.length)
  }

  /**
   * Select a specific model from the list
   * @param index Index in the models list
   */
  select_model(index: number) {
    this.current_model = mod(index, this.models.length)
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

    this.models.forEach((m) => {
      m.vertex_buffer.create(device)
      m.index_buffer.create(device)
    })

    const imports = this.sketch.imports ?? []
    const import_promises = imports.map((x) => x.fetch_wgsl())
    const shader_module = await compile_shader(device, [
      MACHINE_LIBRARY.input_uniforms.fetch_wgsl(),
      MACHINE_LIBRARY.shape.fetch_wgsl(),
      ...import_promises,
      fetch_text(this.sketch.shader_url)
    ])

    const vertex_state: GPUVertexState = {
      module: shader_module,
      entryPoint: 'vertex_main',
      buffers: this.models.map((m) => m.vertex_buffer.buffer_layout)
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
    const model = this.models[this.current_model]

    this.render_pipeline.render(encoder, context, bind_group, (pass) => {
      model.vertex_buffer.attach(pass)
      model.index_buffer.attach(pass)
      pass.drawIndexed(model.index_buffer.count)
    })
  }
}
