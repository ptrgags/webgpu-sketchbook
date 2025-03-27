import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import type { SphereTracerSketch } from '@/machines/SphereTracerMachine'
import MELTAWAY_SHADER from '@/shaders/meltaway.wgsl?url'

export class MeltawaySketch implements SphereTracerSketch {
  shader_url: string = MELTAWAY_SHADER
  imports = [SHADER_LIBRARY.sdf3d, SHADER_LIBRARY.srgb]
}
