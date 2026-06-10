import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_normal, type Vec3 } from './geometry.js'

const PHI = 0.5 * (1 + Math.sqrt(5))
const l = 1.0 / Math.sqrt(3 * (PHI + 1))

const short = l
const long = PHI * PHI * l
const diag = PHI * l

const DODECAHEDRON_POSITIONS: Vec3[] = [
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
  [short, 0, -long],
  // 12-15 top layer of cube corners
  [diag, diag, diag],
  [-diag, diag, diag],
  [-diag, -diag, diag],
  [diag, -diag, diag],
  // 16-19 bottom layer of cube corners
  [diag, diag, -diag],
  [-diag, diag, -diag],
  [-diag, -diag, -diag],
  [diag, -diag, -diag]
]

const FACE_PENTAGONS = [
  // 2 faces around +z
  {
    positions: [8, 12, 4, 13, 9]
  },
  {
    positions: [9, 14, 5, 15, 8]
  },
  // 2 faces around -z
  {
    positions: [11, 19, 6, 18, 10]
  },
  {
    positions: [10, 17, 7, 16, 11]
  },
  // 2 faces around +x
  {
    positions: [0, 12, 8, 15, 3]
  },
  {
    positions: [3, 19, 15, 16, 0]
  },
  // 2 faces around -x
  {
    positions: [2, 14, 9, 13, 1]
  },
  {
    positions: [1, 17, 10, 18, 2]
  },
  // 2 faces around +y
  {
    positions: [4, 12, 0, 16, 7]
  },
  {
    positions: [7, 17, 1, 13, 4]
  },
  // 2 faces around -y
  {
    positions: [6, 19, 3, 15, 5]
  },
  {
    positions: [5, 14, 2, 18, 6]
  }
]

// TODO: Make a better UV map
const FACE_UVS = [
  [1 / 4, 0],
  [3 / 4, 0],
  [1, 1 / 2],
  [1 / 2, 3 / 4],
  [0, 1 / 2]
].flat()

// Triangulate each pentagon into a triangle fan
const PENT_INDICES = [0, 1, 2, 0, 2, 3, 0, 3, 4]
const INDICES = FACE_PENTAGONS.flatMap((_, i) => PENT_INDICES.map((x) => 5 * i + x))

const POSITIONS = FACE_PENTAGONS.flatMap((face) => {
  return face.positions.flatMap((idx) => DODECAHEDRON_POSITIONS[idx])
})

const UVS = FACE_PENTAGONS.flatMap(() => FACE_UVS)

const NORMALS = FACE_PENTAGONS.flatMap((pent) => {
  const [ia, ib, ic] = pent.positions
  const a = DODECAHEDRON_POSITIONS[ia]
  const b = DODECAHEDRON_POSITIONS[ib]
  const c = DODECAHEDRON_POSITIONS[ic]
  const normal = compute_normal(a, b, c)
  return [...normal, ...normal, ...normal, ...normal, ...normal]
})

export const DODECAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
