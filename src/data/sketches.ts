import { QuadMachine } from '@/machines/QuadMachine'
import { SphereTracerMachine } from '@/machines/SphereTracerMachine'
import { EyesSketch } from '@/sketches/EyesSketch'
import { MeltawaySketch } from '@/sketches/MeltawaySketch'
import { StripeyRingSketch } from '@/sketches/StripeyRingSketch'
import { SunAndMoonSketch } from '@/sketches/SunAndMoonSketch'
import type { Machine } from '@/webgpu/Engine'

export type SketchType = 'quad' | 'sphere-tracer'

export interface SketchMetadata {
  id: string
  title: string
  years: string
  type: SketchType
  make_machine(): Machine
  description: string
}

export const SKETCHES: SketchMetadata[] = [
  {
    id: 'stripey-ring',
    title: 'Stripey Ring',
    years: '2025',
    type: 'quad',
    make_machine: () => new QuadMachine(new StripeyRingSketch()),
    description: `<p>lorem ipsum</p>`
  },
  {
    id: 'meltaway',
    title: 'Meltaway',
    years: '2025',
    type: 'sphere-tracer',
    make_machine: () => new SphereTracerMachine(new MeltawaySketch()),
    description: `
    <p> lorem ipsum alakazam
    </p>
    `
  },
  {
    id: 'sun-and-moon',
    title: 'Sun and Moon',
    years: '2024-2025',
    type: 'quad',
    make_machine: () => new QuadMachine(new SunAndMoonSketch()),
    description: `
    <p>
    </p>
    `
  },
  {
    id: 'eyes',
    title: 'Eyes',
    years: '2024-2025',
    type: 'quad',
    make_machine: () => new QuadMachine(new EyesSketch()),
    description: `
    <p>
    </p>
    `
  }
]

export function find_sketch(id: string): SketchMetadata | undefined {
  return SKETCHES.find((x) => x.id === id)
}
