import { describe, it, expect } from 'vitest'
import { Plane } from './Plane'
import { Point } from './Point'

describe('Plane', () => {
  it('constructor normalizes Euclidean line', () => {
    const line = new Plane(3, 4, 5)

    expect(line.is_infinite).toBe(false)
    expect(line.nx).toBe(3 / 5)
    expect(line.ny).toBe(4 / 5)
    expect(line.d).toBe(1)
  })

  it("constructor doesn't modify line at infinity", () => {
    const line = new Plane(0, 0, 42)

    expect(line.is_infinite).toBe(true)
    expect(line.nx).toBe(0)
    expect(line.ny).toBe(0)
    expect(line.d).toBe(42)
  })

  it('meet of axes returns origin', () => {
    const a = Plane.X_AXIS
    const b = Plane.Y_AXIS

    const result = a.meet(b)

    expect(result).toBePoint(Point.ORIGIN)
  })

  it('meet of two lines returns their intersection', () => {
    const a = new Plane(1, 1, 1)
    const b = new Plane(1, -1, 2)

    const result = a.meet(b)

    const expected = new Point(1.5, -0.5)
    expect(result).toBePoint(expected)
  })
})
