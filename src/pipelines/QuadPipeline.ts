import type { RenderPipelineTemplate } from '@/webgpu/RenderPipeline'
import { VertexAttribute, VertexBuffer } from '@/webgpu/VertexBuffer'

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

const UVS_RAW = [
  // top left triangle
  [0, 0],
  [0, 1],
  [1, 0],
  // bottom right triangle
  [1, 0],
  [0, 1],
  [1, 1]
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

const QUAD_VERTICES = 6

export interface QuadPipelineOptions {
  uvs: 'raw' | 'centered'
}

export class QuadPipeline implements RenderPipelineTemplate {
  options: QuadPipelineOptions
  vertex_buffer: VertexBuffer

  constructor(options: QuadPipelineOptions) {
    this.options = options

    const uv_values = options.uvs === 'raw' ? UVS_RAW : UVS_CENTERED

    const positions = new VertexAttribute(QUAD_VERTICES, 2, QUAD_POSITIONS)
    const uvs = new VertexAttribute(QUAD_VERTICES, 2, uv_values)
    this.vertex_buffer = new VertexBuffer('quad_vertices', [positions, uvs])
  }

  make_vertex_buffer(device: GPUDevice): GPUBuffer {
    return this.vertex_buffer.create(device)
  }

  render_pass(pass: GPURenderPassEncoder) {
    //pass.setVertexBuffer(0, this.vertex_buffer)
    pass.draw(QUAD_VERTICES)
  }
}
