import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_face_normal } from './compute_face_normal.js'
import { Vec3 } from '@/core/Vec3.js'

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
].map(Vec3.from_array)

const FACE_TRIANGLES: [number, number, number][] = [
  // top face
  [0, 2, 3],
  // left face
  [0, 3, 1],
  // right face
  [0, 1, 2],
  // bottom face
  [1, 3, 2]
]

// All the faces will be the bottom left half triangle of a UV square
const FACE_UVS = [
  [0, 0],
  [1, 0],
  [0, 1]
].flat()

const NORMALS = FACE_TRIANGLES.flatMap((tri) => compute_face_normal(tri, TETRAHEDRON_POSITIONS))

const TRIANGLE_INDICES = [0, 1, 2]
const INDICES = FACE_TRIANGLES.flatMap((_, i) => TRIANGLE_INDICES.map((x) => 3 * i + x))

const POSITIONS = FACE_TRIANGLES.flatMap((tri) => {
  return tri.flatMap((idx) => TETRAHEDRON_POSITIONS[idx].to_array())
})

const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)

export const TETRAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
