export const TRIANGLES = 3
export const QUADS = 4
export const PENTAGONS = 5

function get_indices(n: number): number[] {
  if (n === TRIANGLES) {
    return [0, 1, 2]
  }

  if (n === QUADS) {
    return [0, 1, 2, 0, 2, 3]
  }

  if (n === PENTAGONS) {
    return [0, 1, 2, 0, 2, 3, 0, 3, 4]
  }

  throw new Error('not implemented')
}

/**
 * Tesselate a regular n-gon into a list of triangles
 * @param face_count Number of faces to generate
 * @param n The number of sides per face (e.g. 3 for triangle, 4 for quad)
 * @returns Indices to add to a Mesh
 */
export function tesselate_fan(face_count: number, n: number): number[] {
  const face_indices = get_indices(n)
  const vertices_per_face = face_indices.length
  const result = new Array(face_count * vertices_per_face)
  for (let i = 0; i < face_count; i++) {
    for (let j = 0; j < vertices_per_face; j++) {
      result[i * vertices_per_face + j] = i * n + face_indices[j]
    }
  }
  return result
}
