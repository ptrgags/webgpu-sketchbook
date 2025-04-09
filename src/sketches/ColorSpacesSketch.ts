import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import { QuadUVMode } from '@/machines/QuadMachine'
import type { SphereTracerSketch } from '@/machines/SphereTracerMachine'
import COLOR_SPACES_SHADER from '@/shaders/color_spaces.wgsl?url'

export class ColorSpacesSketch implements SphereTracerSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  shader_url: string = COLOR_SPACES_SHADER
  fragment_entry = 'fragment_main'
  imports = [SHADER_LIBRARY.sdf3d, SHADER_LIBRARY.csg, SHADER_LIBRARY.srgb]
}
