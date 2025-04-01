import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import STRIPEY_RING_SHADER from '@/shaders/stripey_ring.wgsl?url'

export class StripeyRingSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = STRIPEY_RING_SHADER
  imports = [SHADER_LIBRARY.sdf2d, SHADER_LIBRARY.csg]
}
