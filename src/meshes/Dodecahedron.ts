import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_face_normal } from './compute_face_normal.js'
import { Vec3 } from '@/core/Vec3.js'

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
].map(Vec3.from_array)

const FACE_PENTAGONS: [number, number, number, number, number][] = [
  // 2 faces around +z
  [8, 12, 4, 13, 9],
  [9, 14, 5, 15, 8],
  // 2 faces around -z
  [11, 19, 6, 18, 10],
  [10, 17, 7, 16, 11],
  // 2 faces around +x
  [0, 12, 8, 15, 3],
  [3, 19, 11, 16, 0],
  // 2 faces around -x
  [2, 14, 9, 13, 1],
  [1, 17, 10, 18, 2],
  // 2 faces around +y
  [4, 12, 0, 16, 7],
  [7, 17, 1, 13, 4],
  // 2 faces around -y
  [6, 19, 3, 15, 5],
  [5, 14, 2, 18, 6]
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
  return face.flatMap((idx) => DODECAHEDRON_POSITIONS[idx].to_array())
})

const UVS = FACE_PENTAGONS.flatMap(() => FACE_UVS)
const NORMALS = FACE_PENTAGONS.flatMap((pent) => compute_face_normal(pent, DODECAHEDRON_POSITIONS))

export const DODECAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
