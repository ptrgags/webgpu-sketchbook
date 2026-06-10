import type { Line } from './Line.js'
import { Odd } from './Odd.js'
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

  add(other: Direction) {
    throw new Error('not implemented')
  }

  sub(other: Direction) {
    throw new Error('not implemented')
  }

  join(other: Point | Direction): Line {
    throw new Error('not implemented')
  }
}
