import type { Vec3 } from '../core/Vec3.js'
import { compute_normal } from './geometry.js'
import { VertexAttribute } from '../webgpu/VertexBuffer.js'
import { repeat_array } from '../core/repeat_array.js'
import { COMPONENTS_VEC3 } from '../core/sizes.js'

/**
 * Compute the components for face normals for a single face
 * @param face_indices Array of indices defining a single face. The length of the face
 * @param positions Position data
 * @returns An array of float components for the normal, repeated for each vertex
 */
function compute_face_normal(face_indices: number[], positions: Vec3[]): number[] {
  // check how many vertices per face. e.g. 3 for triangle or 4 for quad
  const num_vertices = face_indices.length

  // For a face normal, we need any 3 adjacent vertices in CCW order
  // so pick the first three
  const [ia, ib, ic] = face_indices

  const a = positions[ia]
  const b = positions[ib]
  const c = positions[ic]
  const normal = compute_normal(a, b, c)

  return repeat_array(normal.to_array(), num_vertices)
}

/**
 *
 * @param faces Array of faces, each an array of indices
 * @param positions
 * @returns
 */
export function gather_face_normals(faces: number[][], positions: Vec3[]): VertexAttribute {
  const coords = faces.flatMap((face) => compute_face_normal(face, positions))
  return new VertexAttribute(COMPONENTS_VEC3, coords)
}
