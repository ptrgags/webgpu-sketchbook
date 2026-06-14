import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_face_normal } from './compute_face_normal.js'
import { Vec3 } from '@/core/Vec3.js'

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
].map(([x, y, z]) => new Vec3(x, y, z))

const FACE_TRIANGLES: [number, number, number][] = [
  // 2 faces around +z
  [8, 4, 9],
  [9, 5, 8],

  // 2 faces around -z
  [11, 6, 10],
  [10, 7, 11],

  // 2 faces around +x
  [0, 8, 3],
  [3, 11, 0],

  // 2 faces around -x
  [2, 9, 1],
  [1, 10, 2],

  // 2 faces around +y
  [4, 0, 7],
  [7, 1, 4],

  // 2 faces around -y
  [6, 3, 5],
  [5, 2, 6],

  // 4 faces at the corners of the top
  [0, 4, 8],
  [1, 9, 4],
  [2, 5, 9],
  [3, 8, 5],

  // 4 faces at the corners of the bottom
  [0, 11, 7],
  [1, 7, 10],
  [2, 10, 6],
  [3, 6, 11]
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
  return face.flatMap((idx) => ICOSAHEDRON_POSITIONS[idx].to_array())
})

const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)
const NORMALS = FACE_TRIANGLES.flatMap((tri) => compute_face_normal(tri, ICOSAHEDRON_POSITIONS))

export const ICOSAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
