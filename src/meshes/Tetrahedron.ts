import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { gather_face_normals } from './compute_face_normal.js'
import { Vec3 } from '@/core/Vec3.js'
import { gather_positions } from './gather_positions.js'
import { tesselate_fan } from './tessellate_fan.js'
import type { Mesh } from './Mesh.js'

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
const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)

export const TETRAHEDRON_GEOMETRY: Mesh = {
  label: 'tetrahedron',
  positions: gather_positions(FACE_TRIANGLES, TETRAHEDRON_POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: gather_face_normals(FACE_TRIANGLES, TETRAHEDRON_POSITIONS),
  indices: tesselate_fan(FACE_TRIANGLES.length, 3)
}
