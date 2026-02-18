import { VertexAttribute } from '@/webgpu/VertexBuffer.js'

const CUBE_POSITIONS = [
  [0, 0, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 0, 0],
  [1, 0, 1],
  [1, 1, 0],
  [1, 1, 1]
]

const FACE_QUADS = [
  {
    positions: [0, 1, 2, 3],
    normal: [1, 0, 0]
  },
  {
    positions: [0, 1, 2, 3],
    normal: [-1, 0, 0]
  },
  {
    positions: [0, 1, 2, 3],
    normal: [0, 1, 0]
  },
  {
    positions: [0, 1, 2, 3],
    normal: [0, -1, 0]
  },
  {
    positions: [0, 1, 2, 3],
    normal: [0, 0, 1]
  },
  {
    positions: [0, 1, 2, 3],
    normal: [0, 0, -1]
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
