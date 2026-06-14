import type { Vec3 } from '@/core/Vec3.js'
import { compute_normal } from './geometry.js'

export function compute_face_normal(face_indices: number[], positions: Vec3[]): number[] {
  // check how many vertices per face. e.g. 3 for triangle or 4 for quad
  const num_vertices = face_indices.length

  // For a face normal, we need any 3 adjacent vertices in CCW order
  // so pick the first three
  const [ia, ib, ic] = face_indices

  const a = positions[ia]
  const b = positions[ib]
  const c = positions[ic]
  const normal = compute_normal(a, b, c)

  const result = new Array(num_vertices * 3)
  for (let i = 0; i < num_vertices; i++) {
    result[3 * i] = normal.x
    result[3 * i + 1] = normal.y
    result[3 * i + 2] = normal.z
  }
  return result
}
