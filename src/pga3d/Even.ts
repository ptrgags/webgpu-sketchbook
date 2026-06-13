import type { Odd } from './Odd'

export class Even {
  constructor() {}
  add(other: Even): Even {
    throw new Error('not implemented')
  }

  sub(other: Even): Even {
    throw new Error('not implemented')
  }

  dual(): Odd {
    throw new Error('not implemented')
  }

  reverse(): Even {}

  // TODO: is this the right signature?
  vee_even(other: Even): Odd {
    throw new Error('not implemented')
  }

  vee_odd(other: Odd): Even {
    throw new Error('not implemented')
  }

  vee(other: Odd): Even
  vee(other: Even): Odd
  vee(other: Odd | Even): Odd | Even {
    throw new Error('not implemented')
  }

  equals(other: Even): boolean {
    throw new Error('not implemented')
  }

  sandwich_even(other: Even): Even {
    throw new Error('not implemented')
  }
  sandwich_odd(other: Odd): Odd {
    throw new Error('not implemented')
  }

  sandwich(other: Even): Even
  sandwich(other: Odd): Odd
  sandwich(other: Even | Odd): Even | Odd {
    if (other instanceof Even) {
      return this.sandwich_even(other)
    }

    return this.sandwich_odd(other)
  }

  static lerp(a: Even, b: Even, t: number): Even {
    throw new Error('not implemented')
  }

  toString(): string {
    throw new Error('not implemented')
  }

  static readonly ZERO = new Even(0, 0, 0, 0, 0, 0, 0, 0)
  static readonly IDENTITY = new Even(1, 0, 0, 0, 0, 0, 0, 0)
}
