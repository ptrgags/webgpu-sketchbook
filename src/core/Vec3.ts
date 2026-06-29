/**
 * Vector of numbers for passing to the GPU
 */
export class Vec3 {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  to_array(): [number, number, number] {
    return [this.x, this.y, this.z]
  }

  static from_array(values: number[]): Vec3 {
    const [x, y, z] = values
    return new Vec3(x, y, z)
  }
}
