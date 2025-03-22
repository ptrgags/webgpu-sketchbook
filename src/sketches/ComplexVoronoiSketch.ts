import { type QuadMachineSketch, QuadUVMode } from '@/machines/QuadMachine'
import VORONOI_SHADER from '@/shaders/complex_voronoi.wgsl?url'

export class ComplexVoronoiSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  shader_url: string = VORONOI_SHADER
}