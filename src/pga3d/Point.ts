import { is_nearly } from '@/core/is_nearly.js'
import { Direction } from './Direction.js'
import type { JoinLine } from './Line.js'
import { Odd } from './Odd.js'

export class Point {
  trivec: Odd

  constructor(x: number, y: number, z: number) {
    const xyz = 1
    // TODO: Check the signs on this
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

  to_direction(): Direction {
    return new Direction(this.x, this.y, this.z)
  }

  add(dir: Direction): Point {
    throw new Error('not implemented')
  }

  sub(other: Point): Direction {
    throw new Error('not implemented')
  }

  join(other: Point | Direction): JoinLine {
    throw new Error('not implemented')
  }

  dist_sqr(point: Point): number {
    return this.sub(point).mag_sqr()
  }

  dist(point: Point): number {
    return Math.sqrt(this.dist_sqr(point))
  }

  static from_trivec(trivec: Odd) {
    const { xyz, yzo, xzo, xyo } = trivec
    if (is_nearly(xyz, 0)) {
      throw new Error('Trying to create a Point from a direction!')
    }

    const x = yzo / xyz
    const y = xzo / xyz
    const z = xyo / xyz
    return new Point(x, y, z)
  }

  static readonly ORIGIN: Point = new Point(0, 0, 0)
}
