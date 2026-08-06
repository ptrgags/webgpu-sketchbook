import { Vec3 } from '../core/Vec3.js'
import { describe, it, expect } from 'vitest'
import { compute_normal } from './geometry.js'

describe('compute_normal', () => {
  it('with axis-aligned triangle computes correct normal', () => {
    const a = new Vec3(0, 0, 0)
    const b = new Vec3(1, 0, 0)
    const c = new Vec3(0, 0, 1)

    const result = compute_normal(a, b, c)

    const expected = new Vec3(0, -1, 0)
    expect(result).toEqual(expected)
  })

  it('with angled triangle computes correct normal', () => {
    const a = new Vec3(1, 0, 0)
    const b = new Vec3(0, 1, 0)
    const c = new Vec3(0, 0, 1)

    const result = compute_normal(a, b, c)

    const radius = 1 / Math.sqrt(3)
    const expected = new Vec3(radius, radius, radius)
    expect(result).toEqual(expected)
  })
})
