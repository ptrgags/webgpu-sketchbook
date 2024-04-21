import { fetch_text } from '@/core/fetch_text'
import type { Machine } from '@/webgpu/Renderer'
import { VertexAttribute, VertexBuffer } from '@/webgpu/VertexBuffer'
import QUAD_MACHINE_SHADER from '@/shaders/quad_machine.wgsl?url'
import { compile_shader } from '@/webgpu/compile_shader'
import { RenderPipeline } from '@/webgpu/RenderPipeline'

// This should go somewhere more common.
const WIDTH = 500
const HEIGHT = 700

// position (x, y, 0, 1). zw is set in the shader.
const QUAD_POSITIONS = [
  // top left triangle
  [-1, 1],
  [-1, -1],
  [1, 1],
  // bottom right triangle
  [1, 1],
  [-1, -1],
  [1, -1]
].flat()

const UVS_BASIC = [
  // top left triangle
  [0, 1],
  [0, 0],
  [1, 1],
  // bottom right triangle
  [1, 1],
  [0, 0],
  [1, 0]
].flat()

// Centered UVs go from [-1, 1] in the x direction,
// but [-1/aspect_ratio, 1/aspect_ratio] in the y direction
// so the aspect ratio is square
const U_MAX = 1.0
const V_MAX = HEIGHT / WIDTH
const UVS_CENTERED = [
  // top left triangle
  [-U_MAX, V_MAX],
  [-U_MAX, -V_MAX],
  [U_MAX, V_MAX],
  // bottom right triangle
  [U_MAX, V_MAX],
  [-U_MAX, -V_MAX],
  [-U_MAX, V_MAX]
].flat()

const NUM_VERTICES = 6

export enum QuadUVMode {
  /**
   * Basic UV coordinates = pixel / resolution
   * [0, 1] in each direction starting at the bottom left corner, v up.
   */
  Basic,
  /**
   * Centered UV coordinates = (pixel - resolution / 2) / resolution.x
   *
   * [-1, 1] in u direction
   * [-1/aspect_ratio, 1/aspect_ratio] (v-up) in v direction
   */
  Centered
}

export interface QuadMachineSketch {
  uv_mode: QuadUVMode
}

export class QuadMachine implements Machine {
  private sketch: QuadMachineSketch
  private vertex_buffer: VertexBuffer
  private render_pipeline: RenderPipeline

  constructor(sketch: QuadMachineSketch) {
    this.sketch = sketch
    this.render_pipeline = new RenderPipeline()

    const uv_values = this.sketch.uv_mode == QuadUVMode.Basic ? UVS_BASIC : UVS_CENTERED

    const positions = new VertexAttribute(NUM_VERTICES, 2, QUAD_POSITIONS)
    const uvs = new VertexAttribute(NUM_VERTICES, 2, uv_values)
    this.vertex_buffer = new VertexBuffer('quad_vertices', [positions, uvs])
  }

  async create_resources(device: GPUDevice, canvas: HTMLCanvasElement, context: GPUCanvasContext) {
    context.configure({
      device,
      // for compositing on the page
      alphaMode: 'opaque',
      // swap chain format
      format: 'bgra8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    })

    this.vertex_buffer.create(device)

    const base_shader_code = await fetch_text(QUAD_MACHINE_SHADER)
    // TODO: Concatenate with sketch shader
    const shader_module = await compile_shader(device, base_shader_code)

    const vertex_state: GPUVertexState = {
      module: shader_module,
      entryPoint: 'vertex_default',
      buffers: [this.vertex_buffer.buffer_layout]
    }

    const fragment_state: GPUFragmentState = {
      module: shader_module,
      entryPoint: 'fragment_default',
      targets: [
        {
          format: 'bgra8unorm'
        }
      ]
    }

    await this.render_pipeline.create(device, vertex_state, fragment_state)
  }

  configure_passes(encoder: GPUCommandEncoder, context: GPUCanvasContext) {
    this.render_pipeline.render(encoder, context, (pass) => {
      this.vertex_buffer.attach(pass)
      pass.draw(NUM_VERTICES)
    })
  }
}
