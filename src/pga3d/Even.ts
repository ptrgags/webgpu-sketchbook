import { Odd } from './Odd'

export class Even {
  scalar: number;
  xy: number;
  xz: number;
  xo: number;
  yz: number;
  yo: number;
  zo: number;
  xyzo: number;
  constructor(scalar: number, xy: number, xz: number, xo: number, yz: number, yo: number, zo: number, xyzo: number) {
    this.scalar = scalar;
    this.xy = xy;
    this.xz = xz;
    this.xo = xo;
    this.yz = yz;
    this.yo = yo;
    this.zo = zo;
    this.xyzo = xyzo;
  }
  add(other: Even): Even {
    throw new Error('not implemented')
  }

  sub(other: Even): Even {
    throw new Error('not implemented')
  }

  dual(): Odd {
    throw new Error('not implemented')
  }

  reverse(): Even {
    throw new Error('not implemented')
  }

  wedge_even(other: Even): Even {
const _ =     (As*Bs)
const _ = (Aox*Bs + As*Box) -xo 
const _ = (Aoy*Bs + As*Boy) -yo 
const _ = (Aoz*Bs + As*Boz) -zo 
const _ = (As*Bxy + Axy*Bs) xy 
const _ = (As*Bxz + Axz*Bs) xz 
const _ = (As*Byz + Ayz*Bs) yz
const _ = (Aox*Byz + Aoxyz*Bs - Aoy*Bxz + Aoz*Bxy + As*Boxyz + Axy*Boz - Axz*Boy + Ayz*Box) -xyzo
  }

  wedge_odd(other: Odd): Odd {
    const {scalar: As, xy: Axy, xz: Axz, xo: Axo, yz: Ayz, yo: Ayo, zo: Azo} = this
    const {x: Bx, y: By, z: Bz, o: Bo, xyz: Bxyz, xyo: Bxyo, xzo: Bxzo, yzo: Byzo} = other

const o =     (As*Bo)
const x = (As*Bx) 
const y = (As*By) 
const z = (As*Bz)
const xyo = (Aox*By - Aoy*Bx + As*Boxy + Axy*Bo) 
const xzo = (Aox*Bz - Aoz*Bx + As*Boxz + Axz*Bo) 
const yzo = (Aoy*Bz - Aoz*By + As*Boyz + Ayz*Bo) 
const xyz = (As*Bxyz + Axy*Bz - Axz*By + Ayz*Bx)

    return new Odd(x, y, z, o, xyz, xyo, xzo, yzo)
  }

  wedge(other: Odd): Odd
  wedge(other: Even): Even
  wedge(other: Odd | Even): Odd | Even {
    if (other instanceof Odd) {
        return this.wedge_odd(other);
    }

    return this.wedge_even(other);
  }
  

  // TODO: is this the right signature?
  vee_even(other: Even): Odd {
const _ =     (Aox*Byz + Aoxyz*Bs - Aoy*Bxz + Aoz*Bxy + As*Boxyz + Axy*Boz - Axz*Boy + Ayz*Box)
const _ = (Aox*Boxyz + Aoxyz*Box) -xo 
const _ = (Aoxyz*Boy + Aoy*Boxyz) -yo 
const _ = (Aoxyz*Boz + Aoz*Boxyz) -zo 
const _ = (Aoxyz*Bxy + Axy*Boxyz) xy 
const _ = (Aoxyz*Bxz + Axz*Boxyz) xz 
const _ = (Aoxyz*Byz + Ayz*Boxyz) yz
const _ = (Aoxyz*Boxyz) -xyzo
  }

  vee_odd(other: Odd): Even {
const _ =     (Aox*Boyz + Aoxyz*Bo - Aoy*Boxz + Aoz*Boxy) o 
const _ = (Aox*Bxyz + Aoxyz*Bx - Axy*Boxz + Axz*Boxy) x 
const _ = (Aoxyz*By + Aoy*Bxyz - Axy*Boyz + Ayz*Boxy) y 
const _ = (Aoxyz*Bz + Aoz*Bxyz - Axz*Boyz + Ayz*Boxz) z
const _ = (Aoxyz*Boxy) xyo 
const _ = (Aoxyz*Boxz) xzo 
const _ = (Aoxyz*Boyz) yzo 
const _ = (Aoxyz*Bxyz) xyz
  }

  vee(other: Odd): Even
  vee(other: Even): Odd
  vee(other: Odd | Even): Odd | Even {
    if (other instanceof Even) {
        return this.vee_even(other)
    }

    return this.vee_odd(other)
  }

  equals(other: Even): boolean {
    throw new Error('not implemented')
  }

  gp_even(other: Even): Even {
const _ = (As*Bs - Axy*Bxy - Axz*Bxz - Ayz*Byz)
const _ = (Aox*Bs - Aoxyz*Byz - Aoy*Bxy - Aoz*Bxz + As*Box + Axy*Boy + Axz*Boz - Ayz*Boxyz) 𝐞₀₁ 
const _ = (Aox*Bxy + Aoxyz*Bxz + Aoy*Bs - Aoz*Byz + As*Boy - Axy*Box + Axz*Boxyz + Ayz*Boz) 𝐞₀₂ 
const _ = (Aox*Bxz - Aoxyz*Bxy + Aoy*Byz + Aoz*Bs + As*Boz - Axy*Boxyz - Axz*Box - Ayz*Boy) 𝐞₀₃ 
const _ = (As*Bxy + Axy*Bs - Axz*Byz + Ayz*Bxz) 𝐞₁₂ 
const _ = (As*Bxz + Axy*Byz + Axz*Bs - Ayz*Bxy) 𝐞₁₃ 
const _ = (As*Byz - Axy*Bxz + Axz*Bxy + Ayz*Bs) 𝐞₂₃
const _ = (Aox*Byz + Aoxyz*Bs - Aoy*Bxz + Aoz*Bxy + As*Boxyz + Axy*Boz - Axz*Boy + Ayz*Box) 𝐞₀₁₂₃
  }

  gp_odd(other: Odd): Odd {
const _ = (Ao*Bs - Aoxy*Bxy - Aoxz*Bxz - Aoyz*Byz - Ax*Box + Axyz*Boxyz - Ay*Boy - Az*Boz) 𝐞₀ 
const _ = (Ax*Bs - Axyz*Byz - Ay*Bxy - Az*Bxz) 𝐞₁ 
const _ = (Ax*Bxy + Axyz*Bxz + Ay*Bs - Az*Byz) 𝐞₂ 
const _ = (Ax*Bxz - Axyz*Bxy + Ay*Byz + Az*Bs) 𝐞₃
const _ = (Ao*Bxy + Aoxy*Bs - Aoxz*Byz + Aoyz*Bxz - Ax*Boy - Axyz*Boz + Ay*Box - Az*Boxyz) 𝐞₀₁₂ 
const _ = (Ao*Bxz + Aoxy*Byz + Aoxz*Bs - Aoyz*Bxy - Ax*Boz + Axyz*Boy + Ay*Boxyz + Az*Box) 𝐞₀₁₃ 
const _ = (Ao*Byz - Aoxy*Bxz + Aoxz*Bxy + Aoyz*Bs - Ax*Boxyz - Axyz*Box - Ay*Boz + Az*Boy) 𝐞₀₂₃ 
const _ = (Ax*Byz + Axyz*Bs - Ay*Bxz + Az*Bxy) 𝐞₁₂₃
  }

  gp(other: Odd): Even
  gp(other: Even): Odd
  gp(other: Odd | Even): Odd | Even {
    if (other instanceof Even) {
        return this.gp_even(other)
    }

    return this.gp_odd(other)
  }

  unit_sandwich_even(other: Even): Even {
    const scalar = (Bs*(As**2 + Axy**2 + Axz**2 + Ayz**2))
const _ = (2*Aox*Axy*Bxy + 2*Aox*Axz*Bxz + 2*Aox*Ayz*Byz - 2*Aoxyz*As*Byz + 2*Aoxyz*Axy*Bxz - 2*Aoxyz*Axz*Bxy - 2*Aoy*As*Bxy + 2*Aoy*Axz*Byz - 2*Aoy*Ayz*Bxz - 2*Aoz*As*Bxz - 2*Aoz*Axy*Byz + 2*Aoz*Ayz*Bxy + As**2*Box + 2*As*Axy*Boy + 2*As*Axz*Boz - Axy**2*Box + 2*Axy*Ayz*Boz - Axz**2*Box - 2*Axz*Ayz*Boy + Ayz**2*Box) -xo 
const _ = (2*Aox*As*Bxy - 2*Aox*Axz*Byz + 2*Aox*Ayz*Bxz + 2*Aoxyz*As*Bxz + 2*Aoxyz*Axy*Byz - 2*Aoxyz*Ayz*Bxy + 2*Aoy*Axy*Bxy + 2*Aoy*Axz*Bxz + 2*Aoy*Ayz*Byz - 2*Aoz*As*Byz + 2*Aoz*Axy*Bxz - 2*Aoz*Axz*Bxy + As**2*Boy - 2*As*Axy*Box + 2*As*Ayz*Boz - Axy**2*Boy - 2*Axy*Axz*Boz + Axz**2*Boy - 2*Axz*Ayz*Box - Ayz**2*Boy) -yo 
const _ = (2*Aox*As*Bxz + 2*Aox*Axy*Byz - 2*Aox*Ayz*Bxy - 2*Aoxyz*As*Bxy + 2*Aoxyz*Axz*Byz - 2*Aoxyz*Ayz*Bxz + 2*Aoy*As*Byz - 2*Aoy*Axy*Bxz + 2*Aoy*Axz*Bxy + 2*Aoz*Axy*Bxy + 2*Aoz*Axz*Bxz + 2*Aoz*Ayz*Byz + As**2*Boz - 2*As*Axz*Box - 2*As*Ayz*Boy + Axy**2*Boz - 2*Axy*Axz*Boy + 2*Axy*Ayz*Box - Axz**2*Boz - Ayz**2*Boz) -zo 
const _ = (As**2*Bxy - 2*As*Axz*Byz + 2*As*Ayz*Bxz + Axy**2*Bxy + 2*Axy*Axz*Bxz + 2*Axy*Ayz*Byz - Axz**2*Bxy - Ayz**2*Bxy) xy 
const _ = (As**2*Bxz + 2*As*Axy*Byz - 2*As*Ayz*Bxy - Axy**2*Bxz + 2*Axy*Axz*Bxy + Axz**2*Bxz + 2*Axz*Ayz*Byz - Ayz**2*Bxz) xz 
const _ = (As**2*Byz - 2*As*Axy*Bxz + 2*As*Axz*Bxy - Axy**2*Byz + 2*Axy*Ayz*Bxy - Axz**2*Byz + 2*Axz*Ayz*Bxz + Ayz**2*Byz) yz
const _ = (-2*Aox*Ayz*Bs + 2*Aoxyz*As*Bs + 2*Aoy*Axz*Bs - 2*Aoz*Axy*Bs + As**2*Boxyz + Axy**2*Boxyz + Axz**2*Boxyz + Ayz**2*Boxyz) -xyzo
  }
  unit_sandwich_odd(other: Odd): Odd {
const _ =     (2*Aox*As*Bx + 2*Aox*Axy*By + 2*Aox*Axz*Bz + 2*Aoxyz*Axy*Bz - 2*Aoxyz*Axz*By + 2*Aoxyz*Ayz*Bx + 2*Aoy*As*By - 2*Aoy*Axy*Bx + 2*Aoy*Ayz*Bz + 2*Aoz*As*Bz - 2*Aoz*Axz*Bx - 2*Aoz*Ayz*By + As**2*Bo + Axy**2*Bo + Axz**2*Bo + Ayz**2*Bo) o 
const _ = (As**2*Bx + 2*As*Axy*By + 2*As*Axz*Bz - Axy**2*Bx + 2*Axy*Ayz*Bz - Axz**2*Bx - 2*Axz*Ayz*By + Ayz**2*Bx) x 
const _ = (As**2*By - 2*As*Axy*Bx + 2*As*Ayz*Bz - Axy**2*By - 2*Axy*Axz*Bz + Axz**2*By - 2*Axz*Ayz*Bx - Ayz**2*By) y 
const _ = (As**2*Bz - 2*As*Axz*Bx - 2*As*Ayz*By + Axy**2*Bz - 2*Axy*Axz*By + 2*Axy*Ayz*Bx - Axz**2*Bz - Ayz**2*Bz) z
const _ = (-2*Aox*Axz*Bxyz + 2*Aoxyz*Axy*Bxyz - 2*Aoy*Ayz*Bxyz + 2*Aoz*As*Bxyz + As**2*Boxy - 2*As*Axz*Boyz + 2*As*Ayz*Boxz + Axy**2*Boxy + 2*Axy*Axz*Boxz + 2*Axy*Ayz*Boyz - Axz**2*Boxy - Ayz**2*Boxy) xyo 
const _ = (2*Aox*Axy*Bxyz + 2*Aoxyz*Axz*Bxyz - 2*Aoy*As*Bxyz - 2*Aoz*Ayz*Bxyz + As**2*Boxz + 2*As*Axy*Boyz - 2*As*Ayz*Boxy - Axy**2*Boxz + 2*Axy*Axz*Boxy + Axz**2*Boxz + 2*Axz*Ayz*Boyz - Ayz**2*Boxz) xzo 
const _ = (2*Aox*As*Bxyz + 2*Aoxyz*Ayz*Bxyz + 2*Aoy*Axy*Bxyz + 2*Aoz*Axz*Bxyz + As**2*Boyz - 2*As*Axy*Boxz + 2*As*Axz*Boxy - Axy**2*Boyz + 2*Axy*Ayz*Boxy - Axz**2*Boyz + 2*Axz*Ayz*Boxz + Ayz**2*Boyz) yzo 
const _ = (Bxyz*(As**2 + Axy**2 + Axz**2 + Ayz**2)) xyz
  }

  unit_sandwich(other: Even): Even
  unit_sandwich(other: Odd): Odd
  unit_sandwich(other: Even | Odd): Even | Odd {
    if (other instanceof Even) {
      return this.unit_sandwich_even(other)
    }

    return this.unit_sandwich_odd(other)
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
