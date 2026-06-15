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

export function tesselate_fan(face_count: number, n: number): number[] {
  const face_indices = get_indices(n)
  const result = new Array(face_count * face_indices.length)
  for (let i = 0; i < face_count; i++) {
    for (let j = 0; j < face_indices.length; j++) {
      result[i * n + j] = n * i + face_indices[j]
    }
  }
  return result
}
