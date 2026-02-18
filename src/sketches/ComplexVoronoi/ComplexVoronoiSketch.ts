import { type QuadMachineSketch, QuadUVMode } from '@/machines/QuadMachine'
import SHADER from './complex_voronoi.wgsl?url'

export class ComplexVoronoiSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  shader_url: string = SHADER
}
