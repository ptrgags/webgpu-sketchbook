import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import type { SphereTracerSketch } from '@/machines/SphereTracerMachine'
import RAYMARCH_SHADER from '@/shaders/raymarch.wgsl?url'

export class RaymarchSketch implements SphereTracerSketch {
  shader_url: string = RAYMARCH_SHADER
  imports = [SHADER_LIBRARY.sdf3d, SHADER_LIBRARY.srgb]
}
