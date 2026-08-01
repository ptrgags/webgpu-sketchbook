import { VertexAttribute } from '../webgpu/VertexBuffer.js'
import { gather_face_normals } from './compute_face_normal.js'
import { Vec3 } from '../core/Vec3.js'
import { tesselate_fan, TRIANGLES } from './tessellate_fan.js'
import { gather_positions } from './gather_positions.js'
import type { Mesh } from './Mesh.js'

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
const UVS = FACE_TRIANGLES.flatMap(() => FACE_UVS)

export const OCTAHEDRON_GEOMETRY: Mesh = {
  label: 'octahedron',
  positions: gather_positions(FACE_TRIANGLES, OCTAHEDRON_POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: gather_face_normals(FACE_TRIANGLES, OCTAHEDRON_POSITIONS),
  indices: tesselate_fan(FACE_TRIANGLES.length, TRIANGLES)
}
