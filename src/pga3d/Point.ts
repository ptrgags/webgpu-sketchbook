import type { Direction } from './Direction.js'
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

  add(dir: Direction): Point {
    throw new Error('not implemented')
  }

  sub(other: Point): Direction {
    throw new Error('not implemented')
  }

  join(other: Point | Direction): JoinLine {
    throw new Error('not implemented')
  }
}
