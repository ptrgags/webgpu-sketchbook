import { is_nearly } from '@/core/is_nearly.js'
import type { JoinLine } from './Line.js'
import { Odd } from './Odd.js'
import type { Plane } from './Plane.js'
import type { Point } from './Point.js'

export class Direction {
  trivec: Odd

  constructor(x: number, y: number, z: number) {
    const xyz = 0
    // TODO: double check the signs when unit testing. I think at least one
    // will be flipped (probably y?)
    const yzo = x
    const xzo = y
    const xyo = z
    this.trivec = new Odd(0, 0, 0, 0, xyz, xyo, xzo, yzo)
  }

  get x(): number {
    return this.trivec.yzo
  }

  get y(): number {
    return this.trivec.xzo
  }

  get z(): number {
    return this.trivec.xyo
  }

  dual(): Plane {
    throw new Error('not implemented')
  }

  neg(): Direction {
    return new Direction(-this.x, -this.y, -this.z)
  }

  mag_sqr(): number {
    const { yzo: x, xzo: y, xyo: z } = this.trivec
    return x * x + y * y + z * z
  }

  mag(): number {
    return Math.sqrt(this.mag_sqr())
  }

  normalize(): Direction {
    const { x, y, z } = this
    const length = this.mag()
    if (is_nearly(length, 0)) {
      return this
    }

    return new Direction(x / length, y / length, z / length)
  }

  add(other: Direction) {
    throw new Error('not implemented')
  }

  sub(other: Direction) {
    throw new Error('not implemented')
  }

  join(other: Point | Direction): JoinLine {
    throw new Error('not implemented')
  }

  static readonly ZERO: Direction = new Direction(0, 0, 0)
  static readonly DIR_X: Direction = new Direction(1, 0, 0)
  static readonly DIR_Y: Direction = new Direction(0, 1, 0)
  static readonly DIR_Z: Direction = new Direction(0, 0, 1)
}
