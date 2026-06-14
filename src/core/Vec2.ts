/**
 * Vector of 2 numbers for passing to the GPU
 */
export class Vec2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  to_array(): [number, number] {
    return [this.x, this.y]
  }
}
