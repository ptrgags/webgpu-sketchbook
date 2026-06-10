export type Vec3 = [number, number, number]

// temporary until I have a working PGA 3D implementation
// this computes normal = (b - a) x (c - a)
export function compute_normal(
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number]
): [number, number, number] {
  const [ax, ay, az] = a
  const [bx, by, bz] = b
  const [cx, cy, cz] = c
  const abx = bx - ax
  const aby = by - ay
  const abz = bz - az
  const acx = cx - ax
  const acy = cy - ay
  const acz = cz - az

  const nx = aby * acz - abz * acy
  const ny = abz * acx - abx * acz
  const nz = abx * acy - aby - acx
  return [nx, ny, nz]
}
