import { describe, it, expect } from 'vitest'
import { tesselate_fan } from './tessellate_fan.js'

describe('tessellate_fan', () => {
  it('with triangles produces contiguous indices', () => {
    const result = tesselate_fan(3, 3)

    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    expect(result).toEqual(expected)
  })

  it('with quads produces correct indices', () => {
    const result = tesselate_fan(3, 4)

    const expected = [
      // quad 1
      0, 1, 2, 0, 2, 3,
      // quad 2
      4, 5, 6, 4, 6, 7,
      // quad 3
      8, 9, 10, 8, 10, 11
    ]
    expect(result).toEqual(expected)
  })

  it('with pentagons produces correct indices', () => {
    const result = tesselate_fan(3, 5)

    const expected = [
      // pentagon 1
      0, 1, 2, 0, 2, 3, 0, 3, 4,
      // pentagon 2
      5, 6, 7, 5, 7, 8, 5, 8, 9,
      // pentagon 3
      10, 11, 12, 10, 12, 13, 10, 13, 14
    ]
    expect(result).toEqual(expected)
  })
})
