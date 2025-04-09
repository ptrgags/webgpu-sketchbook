import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import type { SphereTracerSketch } from '@/machines/SphereTracerMachine'
import COLOR_SPACES_SHADER from '@/shaders/color_spaces.wgsl?url'

export class ColorSpacesSketch implements SphereTracerSketch {
  shader_url: string = COLOR_SPACES_SHADER
  imports = [SHADER_LIBRARY.sdf3d, SHADER_LIBRARY.csg, SHADER_LIBRARY.srgb]
}
