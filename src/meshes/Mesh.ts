import type { VertexAttribute } from '../webgpu/VertexBuffer.js'

export interface Mesh {
  label: string
  positions: VertexAttribute
  normals: VertexAttribute
  uvs: VertexAttribute
  indices: number[]
}
