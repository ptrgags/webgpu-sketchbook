import { QuadMachine } from '../machines/QuadMachine'
import { SphereTracerMachine } from '../machines/SphereTracerMachine'
import { OklchVisualizerSketch } from '../sketches/oklch-visualizer/OklchVisualizerSketch'
import { EyesSketch } from '../sketches/eyes/EyesSketch'
import { MeltawaySketch } from '../sketches/meltaway/MeltawaySketch'
import { StripeyRingSketch } from '../sketches/stripey-ring/StripeyRingSketch'
import { SunAndMoonSketch } from '../sketches/sun-and-moon/SunAndMoonSketch'
import type { Machine } from '../webgpu/Engine'
import { BooleanColorSketch } from '../sketches/boolean-color/BooleanColorSketch.js'
import { ScrambledShapesSketch } from '../sketches/scrambled-shapes/ScrambledShapesSketch.js'
import { ShapeMachine } from '../machines/ShapeMachine.js'
import { SRGBCubeSketch } from '../sketches/srgb-cube/SRGBCubeSketch.js'
import { PlatonicSolidsSketch } from '../sketches/platonic-solids/PlatonicSolidsSketch.js'
import { BooleanColorClockSketch } from '../sketches/boolean-color-clock/BooleanColorClockSketch.js'

export type SketchType = 'quad' | 'sphere-tracer' | 'shape'

export interface SketchMetadata {
  id: string
  title: string
  years: string
  type: SketchType
  make_machine(): Machine
  description: string
  is_lab?: boolean
}

export const SKETCHES: SketchMetadata[] = [
  {
    id: 'boolean-color-clock',
    title: 'Boolean Color Clock',
    years: '2026-07',
    type: 'quad',
    make_machine: () => new QuadMachine(new BooleanColorClockSketch()),
    description: ``,
    is_lab: false
  },
  {
    is_lab: true,
    id: 'platonic-solids',
    title: 'Platonic Solids',
    years: '2026-06',
    type: 'shape',
    make_machine: () => new ShapeMachine(new PlatonicSolidsSketch()),
    description: ``
  },
  {
    is_lab: true,
    id: 'srgb-cube',
    title: 'sRGB Cube',
    years: '2026-01',
    type: 'shape',
    make_machine: () => new ShapeMachine(new SRGBCubeSketch()),
    description: `
    
    `
  },
  {
    is_lab: true,
    id: 'scrambled-shapes',
    title: 'Scrambled Shapes',
    years: '2026-02',
    type: 'quad',
    make_machine: () => new QuadMachine(new ScrambledShapesSketch()),
    description: `
    
    `
  },
  {
    id: 'boolean-color',
    title: 'Boolean Color',
    years: '2026-01',
    type: 'quad',
    make_machine: () => new QuadMachine(new BooleanColorSketch()),
    description: `
    `
  },
  {
    id: 'stripey-ring',
    title: 'Stripey Ring',
    years: '2025',
    is_lab: true,
    type: 'quad',
    make_machine: () => new QuadMachine(new StripeyRingSketch()),
    description: `
    
    `
  },
  {
    id: 'oklch-visualizer',
    title: 'OKLCH Visualizer',
    years: '2025',
    is_lab: true,
    type: 'sphere-tracer',
    make_machine: () => new SphereTracerMachine(new OklchVisualizerSketch()),
    description: `
    
    `
  },
  {
    id: 'meltaway',
    title: 'Meltaway',
    years: '2025',
    type: 'sphere-tracer',
    make_machine: () => new SphereTracerMachine(new MeltawaySketch()),
    description: `
    
    `
  },
  {
    id: 'sun-and-moon',
    title: 'Sun and Moon',
    years: '2024-2025',
    type: 'quad',
    make_machine: () => new QuadMachine(new SunAndMoonSketch()),
    description: `
    `
  },
  {
    id: 'eyes',
    title: 'Eyes',
    years: '2024',
    type: 'quad',
    make_machine: () => new QuadMachine(new EyesSketch()),
    description: `
    `
  }
]

export function find_sketch(id: string): SketchMetadata | undefined {
  return SKETCHES.find((x) => x.id === id)
}
