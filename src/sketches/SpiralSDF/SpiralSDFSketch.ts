import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import SHADER from './spiral_sdf.wgsl?url'

export class SpiralSDFSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.sdf2d, SHADER_LIBRARY.constants]
}
