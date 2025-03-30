import { QuadMachine } from '@/machines/QuadMachine'
import { SphereTracerMachine } from '@/machines/SphereTracerMachine'
import { EyesSketch } from '@/sketches/EyesSketch'
import { MeltawaySketch } from '@/sketches/MeltawaySketch'
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
    id: 'meltaway',
    title: 'Meltaway',
    years: '2025',
    type: 'sphere-tracer',
    make_machine: () => new SphereTracerMachine(new MeltawaySketch()),
    description: `
    <p>
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
