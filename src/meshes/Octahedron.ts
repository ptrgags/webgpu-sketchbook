import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_normal, type Vec3 } from './geometry.js'

const OCTAHEDRON_POSITIONS: Vec3[] = [
  // north pole
  [0, 0, 1],
  // circle around equator starting at +x
  [1, 0, 0],
  [0, 1, 0],
  [-1, 0, 0],
  [0, -1, 0],
  // south pole
  [0, 0, -1]
]

const FACE_TRIANGLES = [
  // north hemisphere
  {
    positions: [0, 1, 2]
  },
  {
    positions: [0, 2, 3]
  },
  {
    positions: [0, 3, 4]
  },
  {
    positions: [0, 4, 1]
  },
  // south hemisphere
  {
    positions: [5, 1, 4]
  },
  {
    positions: [5, 4, 3]
  },
  {
    positions: [5, 3, 2]
  },
  {
    positions: [5, 2, 1]
  }
]

const FACE_UVS = [
  [0, 0],
  [1, 0],
  [0, 1]
].flat()

const NORMALS = FACE_TRIANGLES.flatMap((tri) => {
  const [ia, ib, ic] = tri.positions
  const a = OCTAHEDRON_POSITIONS[ia]
  const b = OCTAHEDRON_POSITIONS[ib]
  const c = OCTAHEDRON_POSITIONS[ic]
  const normal = compute_normal(a, b, c)
  return [...normal, ...normal, ...normal]
})

const TRIANGLE_INDICES = [0, 1, 2]
const INDICES = FACE_TRIANGLES.flatMap((_, i) => TRIANGLE_INDICES.map((x) => 3 * i + x))

const POSITIONS = FACE_TRIANGLES.flatMap((tri) => {
  return tri.positions.flatMap((idx) => OCTAHEDRON_POSITIONS[idx])
})

const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)

export const OCTAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
