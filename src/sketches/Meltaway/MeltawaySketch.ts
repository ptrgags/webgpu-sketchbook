import type { Machine } from '../../webgpu/Engine.js'
import { SHADER_LIBRARY } from '../../core/ShaderLibrary'
import { SphereTracerMachine, type SphereTracerSketch } from '../../machines/SphereTracerMachine'
import SHADER from './meltaway.wgsl?url'

export class MeltawaySketch implements SphereTracerSketch {
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.sdf3d,
    SHADER_LIBRARY.srgb,
    SHADER_LIBRARY.csg,
    SHADER_LIBRARY.constants
  ]

  static make_machine(): Machine {
    return new SphereTracerMachine(new MeltawaySketch())
  }
}
