import { VertexAttribute } from '@/webgpu/VertexBuffer.js'

// labels by corresponding sRGB colors. The index
// written in binary shows the connection if you interpret
// as a vec3f
const CUBE_POSITIONS = [
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
]

const FACE_QUADS = [
  {
    // +x: white, magenta, red, yellow,
    positions: [0b111, 0b101, 0b100, 0b110],
    normal: [1, 0, 0]
  },
  {
    // -x, black, blue, cyan, green
    positions: [0b000, 0b001, 0b011, 0b010],
    normal: [-1, 0, 0]
  },
  {
    // +y: white, yellow, green, cyan
    positions: [0b111, 0b110, 0b010, 0b011],
    normal: [0, 1, 0]
  },
  {
    // -y: black, red, magenta, blue
    positions: [0b000, 0b100, 0b101, 0b001],
    normal: [0, -1, 0]
  },
  {
    // +z: white, cyan, blue, magenta
    positions: [0b111, 0b011, 0b001, 0b101],
    normal: [0, 0, 1]
  },
  {
    // -z: black, green, yellow, red
    positions: [0b000, 0b010, 0b110, 0b100],
    normal: [0, 1, 0]
  }
]

// Same UVs for each face
const FACE_UVS = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1]
].flat()

// Indices are always marking pairs of triangles
// (0, 1, 2), (2, 3, 0),
// (4, 5, 6), (6, 7, 4),
// ...
// 4 * i + (0, 1, 2), 4 * i + (2, 3, 0)
const QUAD_INDICES = [0, 1, 2, 2, 3, 0]
const INDICES = FACE_QUADS.flatMap((_, i) => QUAD_INDICES.map((x) => 4 * i + x))

const POSITIONS = FACE_QUADS.flatMap((face) => {
  return face.positions.flatMap((idx) => CUBE_POSITIONS[idx])
})

const UVS = FACE_QUADS.flatMap(() => FACE_UVS)

const NORMALS = FACE_QUADS.flatMap((face) => [
  ...face.normal,
  ...face.normal,
  ...face.normal,
  ...face.normal
])

export const CUBE_GEOMETRY = {
  positions: new VertexAttribute(3, POSITIONS),
  uvs: new VertexAttribute(2, UVS),
  normals: new VertexAttribute(3, NORMALS),
  indices: INDICES
}
