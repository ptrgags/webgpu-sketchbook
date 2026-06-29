import { Vec3 } from '@/core/Vec3.js'

// temporary until I have a working PGA 3D implementation
// this computes normal = (b - a) x (c - a)
export function compute_normal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const { x: ax, y: ay, z: az } = a
  const { x: bx, y: by, z: bz } = b
  const { x: cx, y: cy, z: cz } = c
  const abx = bx - ax
  const aby = by - ay
  const abz = bz - az
  const acx = cx - ax
  const acy = cy - ay
  const acz = cz - az

  const nx = aby * acz - abz * acy
  const ny = abz * acx - abx * acz
  const nz = abx * acy - aby * acx

  const length = Math.sqrt(nx * nx + ny * ny + nz * nz)
  return new Vec3(nx / length, ny / length, nz / length)
}
