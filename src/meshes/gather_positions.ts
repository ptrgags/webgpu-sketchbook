import type { Vec3 } from '@/core/Vec3.js'
import { VertexAttribute } from '@/webgpu/VertexBuffer.js'

export function gather_positions(faces: number[][], positions: Vec3[]): VertexAttribute {
  const coordinates = faces.flatMap((face) => face.flatMap((idx) => positions[idx].to_array()))
  return new VertexAttribute(3, coordinates)
}
