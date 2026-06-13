import type { Even } from './Even'

export class Odd {
  x: number
  y: number
  z: number
  o: number
  xyz: number
  xyo: number
  xzo: number
  yzo: number

  constructor(
    x: number,
    y: number,
    z: number,
    o: number,
    xyz: number,
    xyo: number,
    xzo: number,
    yzo: number
  ) {
    this.x = x
    this.y = y
    this.z = z
    this.o = o
    this.xyz = xyz
    this.xyo = xyo
    this.xzo = xzo
    this.yzo = yzo
  }

  add(other: Odd): Odd {
    throw new Error('not implemented')
  }

  norm_sqr(): number {
    throw new Error('not implemented')
  }

  norm(): number {
    throw new Error('not implemented')
  }

  scale(scalar: number): Odd {
    throw new Error('not implemented')
  }

  normalize(): Odd {
    throw new Error('not implemented')
  }

  neg(): Odd {
    throw new Error('not implemented')
  }

  reverse(): Odd {
    throw new Error('not implemented')
  }

  wedge_odd(other: Odd): Even {
    throw new Error('not implemented')
  }

  wedge_even(other: Even): Odd {
    throw new Error('not implemented')
  }

  wedge(other: Even): Odd
  wedge(other: Odd): Even
  wedge(other: Even | Odd): Even | Odd {
    throw new Error('not implemented')
  }

  sandwich_even(other: Even): Even {
    throw new Error('not implemented')
  }

  sandwich_odd(other: Odd): Even {
    throw new Error('not implemented')
  }

  sandwich(other: Even): Even
  sandwich(other: Odd): Odd
  sandwich(other: Even | Odd): Even | Odd {
    throw new Error('not implemented')
  }

  equals(other: Odd): boolean {
    throw new Error('not implemented')
  }

  toString(): string {
    throw new Error('not implemented')
  }

  static readonly ZERO = Object.freeze(new Odd(0, 0, 0, 0, 0, 0, 0, 0))
}
