import { Vec3 } from '@/core/Vec3.js'
import { VertexAttribute } from '@/webgpu/VertexBuffer.js'
import { compute_face_normal, gather_face_normals } from './compute_face_normal.js'
import { QUADS, tesselate_fan } from './tessellate_fan.js'
import { gather_positions } from './gather_positions.js'
import type { Mesh } from './Mesh.js'

// labels by corresponding sRGB colors. The index
// written in binary shows the connection if you interpret
// as a vec3f
const CUBE_POSITIONS: Vec3[] = [
  // black = 0b000
  [-1, -1, -1],
  // blue = 0b001
  [-1, -1, 1],
  // green = 0b010
  [-1, 1, -1],
  // cyan = 0b011
  [-1, 1, 1],
  // red = 0b100
  [1, -1, -1],
  // magenta = 0b101
  [1, -1, 1],
  // yellow = 0b110
  [1, 1, -1],
  // white = 0b111
  [1, 1, 1]
].map(Vec3.from_array)

const FACE_QUADS = [
  // +x: white, magenta, red, yellow,
  [0b111, 0b101, 0b100, 0b110],
  // -x, black, blue, cyan, green
  [0b000, 0b001, 0b011, 0b010],
  // +y: white, yellow, green, cyan
  [0b111, 0b110, 0b010, 0b011],
  // -y: black, red, magenta, blue
  [0b000, 0b100, 0b101, 0b001],
  // +z: white, cyan, blue, magenta
  [0b111, 0b011, 0b001, 0b101],
  // -z: black, green, yellow, red
  [0b000, 0b010, 0b110, 0b100]
]

// Same UVs for each face
const FACE_UVS = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1]
].flat()
const UVS = FACE_QUADS.flatMap(() => FACE_UVS)

export const CUBE_GEOMETRY: Mesh = {
  label: 'cube',
  positions: gather_positions(FACE_QUADS, CUBE_POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: gather_face_normals(FACE_QUADS, CUBE_POSITIONS),
  indices: tesselate_fan(FACE_QUADS.length, QUADS)
}
