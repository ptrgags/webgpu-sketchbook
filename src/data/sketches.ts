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

const base_url = import.meta.env.BASE_URL

export const SKETCHES: SketchMetadata[] = [
  {
    id: 'meltaway',
    title: 'Meltaway',
    years: '2025',
    type: 'sphere-tracer',
    make_machine: () => new SphereTracerMachine(new MeltawaySketch()),
    description: `
    <p>
        Touchscreen: Drag towards the left/right halves of the canvas to rotate the camera.
        Mouse: Hover the mouse towards the left/right halves of the canvas to rotate the camera.
        Keyboard: Left and right arrows to rotate the camera.
    </p>
    <p>
      This was a refresher on sphere tracing (also known as
      <a href="https://iquilezles.org/articles/raymarchingdf/">ray marching</a>).
      Here I have several shapes nested inside each other. Each one has a separate
      clipping plane. They descend upon the shapes one by one, peeling back one
      layer of the shape at a time.
    </p>
    <img width="250" height="350" class="figure" alt="animated diagram of the clipping planes" src="${base_url}/figures/2025-04-07_MeltawaySchematic.gif" />
    <p>
    I've been reading <cite>Artist's Master Series: Color and Light</cite> about
    color theory. The section on matte (diffuse) lighting gives a rule of thumb
    for where to put the lights, midtones and darks on a sphere and other 3D shapes.
    This is what inspired the lighting scheme. It's quite similar to toon shading.
    </p>
    <img width="500" class="figure" alt="digital illustration of shading a sphere" src="${base_url}/figures/2025-04-07_LightingASphereExplainer.png" />
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
        This was an experiment that generalizes
        <a href="https://en.wikipedia.org/wiki/Voronoi_diagram">Voronoi diagrams</a>.
        Usually, a voronoi diagram is a map of "which point is the nearest
        neighbor?". This gives a cellular pattern with sharp edges halfway
        between the seed points.
    </p>
    <p>DIAGRAM of nearest neighbors</p>
    <img width="500" class="figure" alt="voronoi diagram that points out the nearest neighbor properties" src="${base_url}/figures/2025-04-07_VoronoiExplainer.png" />
    <p>However, in shaders, it's commmon to use 
    <a href="https://iquilezles.org/articles/distfunctions2d/">signed distance fields (SDFs)</a>
    to get the minimum distance to a shape. Combining the concepts, the new
    query is "which <em>shape</em> is the nearest neighbor?" This produces some
    unusual shaped cells.
    Sometimes you get straight lines, others you get curved lines
    </p>
    <img width="600" class="figure" alt="graph of a ball next to a wall. In the gap between them, a curve separates points that are closer to the ball from points that are closer to the wall." src="${base_url}/figures/2025-04-07_VoronoiSDFExplainer.png" />
    <p>
        I wanted to pick shapes that interlock somewhat, so I chose a
        stylistic sun and moon.
    <p>
    `
  },
  {
    id: 'eyes',
    title: 'Eyes',
    years: '2024',
    type: 'quad',
    make_machine: () => new QuadMachine(new EyesSketch()),
    description: `<p>
        Touchscreen: Drag around the canvas to direct the eyes. Touch to blink<br/>
        Mouse: Move the cursor to direct the eyes. Click to blink.
        Gamepad: Left joystick or D-pad to move the eyes, A button to blink. <br/>
        Keyboard: Arrows or WASD to move the eyes, Z key to blink.
    </p>
    <p>
      This was just a fun warm-up project when first setting up this repo. I
      was exploring how to handle several types of interaction devices in
      a consistent way.
    </p>
    `
  }
]

export function find_sketch(id: string): SketchMetadata | undefined {
  return SKETCHES.find((x) => x.id === id)
}
