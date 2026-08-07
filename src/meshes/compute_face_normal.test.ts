import { Vec3 } from '../core/Vec3.js'
import { describe, it, expect } from 'vitest'
import { gather_face_normals } from './compute_face_normal.js'

describe('gather_face_normals', () => {
  it('with axis_aligned quads computes correct normals', () => {
    const positions = [
      // bottom face of a cube
      new Vec3(0, 0, 0),
      new Vec3(1, 0, 0),
      new Vec3(1, 1, 0),
      new Vec3(0, 1, 0),
      // two more vertices for a side of the cube
      new Vec3(0, 0, 1),
      new Vec3(1, 0, 1)
    ]
    const faces = [
      [0, 1, 2, 3],
      [0, 4, 5, 1]
    ]

    const result = gather_face_normals(faces, positions).values

    const expected = [
      // +z for the first face
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // +y for the second face
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
    ]
    expect(result).toEqual(expected)
  })

  it('with mixed sizes computes correct normals', () => {
    const positions = [
      // bottom face of a cube
      new Vec3(0, 0, 0),
      new Vec3(1, 0, 0),
      new Vec3(1, 1, 0),
      new Vec3(0, 1, 0)
    ]
    const faces = [
      // quad facing upwards
      [0, 1, 2, 3],
      // triangle facing downwards
      [0, 3, 2]
    ]

    const result = gather_face_normals(faces, positions).values

    const expected = [
      // +z for top quad
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // -z for bottom triangle
      0, 0, -1, 0, 0, -1, 0, 0, -1
    ]
    expect(result).toEqual(expected)
  })

  // TODO Ideally I'd add more tests with normals... but I don't have vector
  // comparison methods just yet.
})
