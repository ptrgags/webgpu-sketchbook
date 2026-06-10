import { is_nearly } from '@/core/is_nearly.js'
import { Odd } from './Odd.js'
import type { MeetLine } from './Line.js'

export class Plane {
  is_infinite: boolean
  vec: Odd

  constructor(nx: number, ny: number, nz: number, d: number) {
    const mag_sqr = nx * nx + ny * ny + nz * nz

    this.is_infinite = is_nearly(mag_sqr, 0)

    if (this.is_infinite) {
      this.vec = new Odd(0, 0, 0, -d, 0, 0, 0, 0)
    } else {
      const mag = Math.sqrt(mag_sqr)
      // a plane in PGA is n_x x + n_y y + n_z z + d = 0, but this constructor
      // defines it as n_x x + n_y y + n_z z = d so d is measured in the direction
      // of the normal. this means we have to negate the negative sign here
      this.vec = new Odd(nx / mag, ny / mag, nz / mag, -d / mag, 0, 0, 0, 0)
    }
  }

  meet(other: Plane): MeetLine {
    throw new Error('not implented')
  }

  static readonly XY_PLANE = new Plane(0, 0, 1, 0)
  static readonly XZ_PLANE = new Plane(0, -1, 0, 0)
  static readonly YZ_PLANE = new Plane(1, 0, 0, 0)
}
