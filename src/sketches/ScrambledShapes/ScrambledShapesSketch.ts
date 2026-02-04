import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import SHADER from './scrambled_shapes.wgsl?url'

export class ScrambledShapesSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.sdf2d]
}
