import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_face_normal } from './compute_face_normal.js'
import { Vec3 } from '@/core/Vec3.js'

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
].map(Vec3.from_array)

const FACE_TRIANGLES = [
  // north hemisphere
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 1],
  // south hemisphere
  [5, 1, 4],
  [5, 4, 3],
  [5, 3, 2],
  [5, 2, 1]
]

const FACE_UVS = [
  [0, 0],
  [1, 0],
  [0, 1]
].flat()

const NORMALS = FACE_TRIANGLES.flatMap((tri) => compute_face_normal(tri, OCTAHEDRON_POSITIONS))

const TRIANGLE_INDICES = [0, 1, 2]
const INDICES = FACE_TRIANGLES.flatMap((_, i) => TRIANGLE_INDICES.map((x) => 3 * i + x))

const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)
const POSITIONS = FACE_TRIANGLES.flatMap((tri) => {
  return tri.flatMap((idx) => OCTAHEDRON_POSITIONS[idx].to_array())
})

export const OCTAHEDRON_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
