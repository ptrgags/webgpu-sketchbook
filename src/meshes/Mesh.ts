import type { VertexAttribute } from '@/webgpu/VertexBuffer.js'

export interface Mesh {
  positions: VertexAttribute
  normals: VertexAttribute
  uvs: VertexAttribute
  indices: number[]
}
