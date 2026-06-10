import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_normal, type Vec3 } from './geometry.js'

const PHI = 0.5 * (1 + Math.sqrt(5))
const d = 1.0 / Math.sqrt(2 + PHI)

const short = d
const long = PHI * d

const ICOSAHEDRON_POSITIONS: Vec3[] = [
  // 0-3 XY-rectangle
  [long, short, 0],
  [-long, short, 0],
  [-long, -short, 0],
  [long, -short, 0],
  // 4-7 YZ-rectangle
  [0, long, short],
  [0, -long, short],
  [0, -long, -short],
  [0, long, -short],
  // 8-11 ZX-rectangle
  [short, 0, long],
  [-short, 0, long],
  [-short, 0, -long],
  [short, 0, -long]
]

const FACE_TRIANGLES = [
  // 2 faces around +z
  {
    positions: [8, 4, 9]
  },
  {
    positions: [9, 5, 8]
  },
  // 2 faces around -z
  {
    positions: [11, 6, 10]
  },
  {
    positions: [10, 7, 11]
  },
  // 2 faces around +x
  {
    positions: [0, 8, 3]
  },
  {
    positions: [3, 11, 0]
  },
  // 2 faces around -x
  {
    positions: [2, 9, 1]
  },
  {
    positions: [1, 10, 2]
  },
  // 2 faces around +y
  {
    positions: [4, 0, 7]
  },
  {
    positions: [7, 1, 4]
  },
  // 2 faces around -y
  {
    positions: [6, 3, 5]
  },
  {
    positions: [5, 2, 6]
  },
  // 4 faces at the corners of the top
  {
    positions: [0, 4, 8]
  },
  {
    positions: [1, 9, 4]
  },
  {
    positions: [2, 5, 9]
  },
  {
    positions: [3, 8, 5]
  },
  // 4 faces at the corners of the bottom
  {
    positions: [0, 11, 7]
  },
  {
    positions: [1, 7, 10]
  },
  {
    positions: [2, 10, 6]
  },
  {
    positions: [3, 6, 11]
  }
]

const FACE_UVS = [
  [0, 0],
  [1, 0],
  [0, 1]
].flat()

// Triangulate each pentagon into a triangle fan
const TRIANGLE_INDICES = [0, 1, 2]
const INDICES = FACE_TRIANGLES.flatMap((_, i) => TRIANGLE_INDICES.map((x) => 3 * i + x))

const POSITIONS = FACE_TRIANGLES.flatMap((face) => {
  return face.positions.flatMap((idx) => ICOSAHEDRON_POSITIONS[idx])
})

const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)

// these seem incorrect...
const NORMALS = FACE_TRIANGLES.flatMap((tri) => {
  const [ia, ib, ic] = tri.positions
  const a = ICOSAHEDRON_POSITIONS[ia]
  const b = ICOSAHEDRON_POSITIONS[ib]
  const c = ICOSAHEDRON_POSITIONS[ic]
  const normal = compute_normal(a, b, c)
  return [...normal, ...normal, ...normal]
})

export const ICOSAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
