import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_normal, type Vec3 } from './geometry.js'

// horizontal distance from the origin to the edges with pairs of points
const a = Math.sqrt(1 / 3)
// half the edge length
const b = Math.sqrt(2 / 3)

// looking down from the +z axis, we see a triangle pointing down
//  __
// \  /
//  \/
const TETRAHEDRON_POSITIONS: Vec3[] = [
  // 0: triangle bottom, top point
  [0, -a, b],
  // 1: triangle bottom, bottom point
  [0, -a, -b],
  // 2: right corner of triangle
  [b, a, 0],
  // 3: left corner of triangle
  [-b, a, 0]
]

const FACE_TRIANGLES = [
  {
    // top face
    positions: [0, 2, 3]
    // normal needs to be calculated
    // UV... what do we want to do here?
  },
  {
    // left face
    positions: [0, 3, 1]
  },
  {
    // right face
    positions: [0, 1, 2]
  },
  {
    // bottom face
    positions: [1, 3, 2]
  }
]

// All the faces will be the bottom left half triangle of a UV square
const FACE_UVS = [
  [0, 0],
  [1, 0],
  [0, 1]
].flat()

const NORMALS = FACE_TRIANGLES.flatMap((tri) => {
  const [ia, ib, ic] = tri.positions
  const a = TETRAHEDRON_POSITIONS[ia]
  const b = TETRAHEDRON_POSITIONS[ib]
  const c = TETRAHEDRON_POSITIONS[ic]
  const normal = compute_normal(a, b, c)
  return [...normal, ...normal, ...normal]
})

const TRIANGLE_INDICES = [0, 1, 2]
const INDICES = FACE_TRIANGLES.flatMap((_, i) => TRIANGLE_INDICES.map((x) => 3 * i + x))

const POSITIONS = FACE_TRIANGLES.flatMap((tri) => {
  return tri.positions.flatMap((idx) => TETRAHEDRON_POSITIONS[idx])
})

const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)

export const TETRAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
