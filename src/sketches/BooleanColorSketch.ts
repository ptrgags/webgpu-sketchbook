import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import BOOLEAN_COLOR_SHADER from '@/shaders/boolean_color.wgsl?url'

export class BooleanColorSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = BOOLEAN_COLOR_SHADER
  imports = []
}
