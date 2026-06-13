import { Even } from './Even'

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

  vee_odd(other: Odd): Even {
const _ =     (Ao*Bxyz + Aoxy*Bz - Aoxz*By + Aoyz*Bx - Ax*Boyz - Axyz*Bo + Ay*Boxz - Az*Boxy)
const _ = (Aoxy*Boxz - Aoxz*Boxy) 𝐞₀₁ 
const _ = (Aoxy*Boyz - Aoyz*Boxy) 𝐞₀₂ 
const _ = (Aoxz*Boyz - Aoyz*Boxz) 𝐞₀₃ 
const _ = (Aoxy*Bxyz - Axyz*Boxy) 𝐞₁₂ 
const _ = (Aoxz*Bxyz - Axyz*Boxz) 𝐞₁₃ 
const _ = (Aoyz*Bxyz - Axyz*Boyz) 𝐞₂₃
  }

  vee_even(other: Even): Odd {
const _ =     (Ao*Boxyz + Aoxy*Boz - Aoxz*Boy + Aoyz*Box) 𝐞₀ 
const _ = (Aoxy*Bxz - Aoxz*Bxy + Ax*Boxyz + Axyz*Box) 𝐞₁ 
const _ = (Aoxy*Byz - Aoyz*Bxy + Axyz*Boy + Ay*Boxyz) 𝐞₂ 
const _ = (Aoxz*Byz - Aoyz*Bxz + Axyz*Boz + Az*Boxyz) 𝐞₃
const _ = (Aoxy*Boxyz) 𝐞₀₁₂ 
const _ = (Aoxz*Boxyz) 𝐞₀₁₃ 
const _ = (Aoyz*Boxyz) 𝐞₀₂₃ 
const _ = (Axyz*Boxyz) 𝐞₁₂₃
  }

  vee(other: Even): Odd
  vee(other: Odd): Even
  vee(other: Even | Odd): Even | Odd {
    throw new Error('not implemented')
  }

  wedge_odd(other: Odd): Even {
const _ =     (Ao*Bx - Ax*Bo) 𝐞₀₁ 
const _ = (Ao*By - Ay*Bo) 𝐞₀₂ 
const _ = (Ao*Bz - Az*Bo) 𝐞₀₃ 
const _ = (Ax*By - Ay*Bx) 𝐞₁₂ 
const _ = (Ax*Bz - Az*Bx) 𝐞₁₃ 
const _ = (Ay*Bz - Az*By) 𝐞₂₃
const _ = (Ao*Bxyz + Aoxy*Bz - Aoxz*By + Aoyz*Bx - Ax*Boyz - Axyz*Bo + Ay*Boxz - Az*Boxy) 𝐞₀₁₂₃
  }

  wedge_even(other: Even): Odd {
const _ =     (Ao*Bs) 𝐞₀ 
const _ = (Ax*Bs) 𝐞₁ 
const _ = (Ay*Bs) 𝐞₂ 
const _ = (Az*Bs) 𝐞₃
const _ = (Ao*Bxy + Aoxy*Bs - Ax*Boy + Ay*Box) 𝐞₀₁₂ 
const _ = (Ao*Bxz + Aoxz*Bs - Ax*Boz + Az*Box) 𝐞₀₁₃ 
const _ = (Ao*Byz + Aoyz*Bs - Ay*Boz + Az*Boy) 𝐞₀₂₃ 
const _ = (Ax*Byz + Axyz*Bs - Ay*Bxz + Az*Bxy) 𝐞₁₂₃
  }

  wedge(other: Even): Odd
  wedge(other: Odd): Even
  wedge(other: Even | Odd): Even | Odd {
    throw new Error('not implemented')
  }

  unit_sandwich_even(other: Even): Even {
const _ =     (Bs*(Ax**2 + Axyz**2 + Ay**2 + Az**2))
const _ = (2*Ao*Axyz*Byz + 2*Ao*Ay*Bxy + 2*Ao*Az*Bxz - 2*Aoxy*Ax*Bxy - 2*Aoxy*Axyz*Bxz + 2*Aoxy*Az*Byz - 2*Aoxz*Ax*Bxz + 2*Aoxz*Axyz*Bxy - 2*Aoxz*Ay*Byz - 2*Aoyz*Ax*Byz + 2*Aoyz*Ay*Bxz - 2*Aoyz*Az*Bxy - Ax**2*Box - 2*Ax*Ay*Boy - 2*Ax*Az*Boz - Axyz**2*Box - 2*Axyz*Ay*Boz + 2*Axyz*Az*Boy + Ay**2*Box + Az**2*Box) 𝐞₀₁ 
const _ = (-2*Ao*Ax*Bxy - 2*Ao*Axyz*Bxz + 2*Ao*Az*Byz - 2*Aoxy*Axyz*Byz - 2*Aoxy*Ay*Bxy - 2*Aoxy*Az*Bxz + 2*Aoxz*Ax*Byz - 2*Aoxz*Ay*Bxz + 2*Aoxz*Az*Bxy - 2*Aoyz*Ax*Bxz + 2*Aoyz*Axyz*Bxy - 2*Aoyz*Ay*Byz + Ax**2*Boy + 2*Ax*Axyz*Boz - 2*Ax*Ay*Box - Axyz**2*Boy - 2*Axyz*Az*Box - Ay**2*Boy - 2*Ay*Az*Boz + Az**2*Boy) 𝐞₀₂ 
const _ = (-2*Ao*Ax*Bxz + 2*Ao*Axyz*Bxy - 2*Ao*Ay*Byz - 2*Aoxy*Ax*Byz + 2*Aoxy*Ay*Bxz - 2*Aoxy*Az*Bxy - 2*Aoxz*Axyz*Byz - 2*Aoxz*Ay*Bxy - 2*Aoxz*Az*Bxz + 2*Aoyz*Ax*Bxy + 2*Aoyz*Axyz*Bxz - 2*Aoyz*Az*Byz + Ax**2*Boz - 2*Ax*Axyz*Boy - 2*Ax*Az*Box - Axyz**2*Boz + 2*Axyz*Ay*Box + Ay**2*Boz - 2*Ay*Az*Boy - Az**2*Boz) 𝐞₀₃ 
const _ = (-Ax**2*Bxy - 2*Ax*Axyz*Bxz + 2*Ax*Az*Byz + Axyz**2*Bxy - 2*Axyz*Ay*Byz - Ay**2*Bxy - 2*Ay*Az*Bxz + Az**2*Bxy) 𝐞₁₂ 
const _ = (-Ax**2*Bxz + 2*Ax*Axyz*Bxy - 2*Ax*Ay*Byz + Axyz**2*Bxz - 2*Axyz*Az*Byz + Ay**2*Bxz - 2*Ay*Az*Bxy - Az**2*Bxz) 𝐞₁₃ 
const _ = (Ax**2*Byz - 2*Ax*Ay*Bxz + 2*Ax*Az*Bxy + Axyz**2*Byz + 2*Axyz*Ay*Bxy + 2*Axyz*Az*Bxz - Ay**2*Byz - Az**2*Byz) 𝐞₂₃
const _ = (-2*Ao*Axyz*Bs + 2*Aoxy*Az*Bs - 2*Aoxz*Ay*Bs + 2*Aoyz*Ax*Bs - Ax**2*Boxyz - Axyz**2*Boxyz - Ay**2*Boxyz - Az**2*Boxyz) 𝐞₀₁₂₃
  }

  unit_sandwich_odd(other: Odd): Odd {
const _ =     (2*Ao*Ax*Bx + 2*Ao*Ay*By + 2*Ao*Az*Bz + 2*Aoxy*Ax*By + 2*Aoxy*Axyz*Bz - 2*Aoxy*Ay*Bx + 2*Aoxz*Ax*Bz - 2*Aoxz*Axyz*By - 2*Aoxz*Az*Bx + 2*Aoyz*Axyz*Bx + 2*Aoyz*Ay*Bz - 2*Aoyz*Az*By - Ax**2*Bo - Axyz**2*Bo - Ay**2*Bo - Az**2*Bo) 𝐞₀ 
const _ = (Ax**2*Bx + 2*Ax*Ay*By + 2*Ax*Az*Bz + Axyz**2*Bx + 2*Axyz*Ay*Bz - 2*Axyz*Az*By - Ay**2*Bx - Az**2*Bx) 𝐞₁ 
const _ = (-Ax**2*By - 2*Ax*Axyz*Bz + 2*Ax*Ay*Bx + Axyz**2*By + 2*Axyz*Az*Bx + Ay**2*By + 2*Ay*Az*Bz - Az**2*By) 𝐞₂ 
const _ = (-Ax**2*Bz + 2*Ax*Axyz*By + 2*Ax*Az*Bx + Axyz**2*Bz - 2*Axyz*Ay*Bx - Ay**2*Bz + 2*Ay*Az*By + Az**2*Bz) 𝐞₃
const _ = (2*Ao*Az*Bxyz + 2*Aoxy*Axyz*Bxyz - 2*Aoxz*Ax*Bxyz - 2*Aoyz*Ay*Bxyz + Ax**2*Boxy + 2*Ax*Axyz*Boxz - 2*Ax*Az*Boyz - Axyz**2*Boxy + 2*Axyz*Ay*Boyz + Ay**2*Boxy + 2*Ay*Az*Boxz - Az**2*Boxy) 𝐞₀₁₂ 
const _ = (-2*Ao*Ay*Bxyz + 2*Aoxy*Ax*Bxyz + 2*Aoxz*Axyz*Bxyz - 2*Aoyz*Az*Bxyz + Ax**2*Boxz - 2*Ax*Axyz*Boxy + 2*Ax*Ay*Boyz - Axyz**2*Boxz + 2*Axyz*Az*Boyz - Ay**2*Boxz + 2*Ay*Az*Boxy + Az**2*Boxz) 𝐞₀₁₃ 
const _ = (2*Ao*Ax*Bxyz + 2*Aoxy*Ay*Bxyz + 2*Aoxz*Az*Bxyz + 2*Aoyz*Axyz*Bxyz - Ax**2*Boyz + 2*Ax*Ay*Boxz - 2*Ax*Az*Boxy - Axyz**2*Boyz - 2*Axyz*Ay*Boxy - 2*Axyz*Az*Boxz + Ay**2*Boyz + Az**2*Boyz) 𝐞₀₂₃ 
const _ = (Bxyz*(Ax**2 + Axyz**2 + Ay**2 + Az**2)) 𝐞₁₂₃
  }

  unit_sandwich(other: Even): Even
  unit_sandwich(other: Odd): Odd
  unit_sandwich(other: Even | Odd): Even | Odd {
    if (other instanceof Even) {
        return this.unit_sandwich_even(other)
    }
    return this.unit_sandwich_odd(other)
  }

  equals(other: Odd): boolean {
    throw new Error('not implemented')
  }

  toString(): string {
    throw new Error('not implemented')
  }

  static readonly ZERO = Object.freeze(new Odd(0, 0, 0, 0, 0, 0, 0, 0))
}
