import type { Vec3 } from './geometry.js'

const PHI = 0.5 * (1 + Math.sqrt(5))
const d = 1.0 / Math.sqrt(PHI + 2)
const l = 1.0 / Math.sqrt(3 * (PHI + 1))

const short = l
const long = PHI * PHI * l
const diag = PHI * l

const DODECAHEDRON_POSITIONS: Vec3[] = [
  // 0-3 XY-rectangle
  [long, short, 0],
  [-long, short, 0],
  [-long, -short, 0],
  [long, -short, 0],
  // 4-7 YZ-rectangle
  [0, long, short],
  [0, -long, short],
  [0, -long, -short],
  [0, long, -short],
  // 8-11 ZX-rectangle
  [short, 0, long],
  [-short, 0, long],
  [-short, 0, -long],
  [short, 0, -long],
  // 12-15 top layer of cube corners
  [diag, diag, diag],
  [-diag, diag, diag],
  [-diag, -diag, diag],
  [diag, -diag, diag],
  // 16-19 bottom layer of cube corners
  [diag, diag, -diag],
  [-diag, diag, -diag],
  [-diag, -diag, -diag],
  [diag, -diag, -diag]
]

const FACE_PENTAGONS = [
  // 2 faces around +z
  {
    positions: [8, 12, 4, 13, 9]
  },
  {
    positions: [9, 14, 5, 15, 8]
  },
  // 2 faces around -z
  {
    positions: [11, 19, 6, 18, 10]
  },
  {
    positions: [10, 17, 7, 16, 11]
  },
  // 2 faces around +x
  {
    positions: [0, 12, 8, 15, 3]
  },
  {
    positions: [3, 19, 15, 16, 0]
  },
  // 2 faces around -x
  {
    positions: [2, 14, 9, 13, 1]
  },
  {
    positions: [1, 17, 10, 18, 2]
  },
  // 2 faces around +y
  {
    positions: [4, 12, 0, 16, 7]
  },
  {
    positions: [7, 17, 1, 13, 4]
  },
  // 2 faces around -y
  {
    positions: [6, 19, 3, 15, 5]
  },
  {
    positions: [5, 14, 2, 18, 6]
  }
]
