import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import type { SphereTracerSketch } from '@/machines/SphereTracerMachine'
import OKLCH_VISUALIZER_SHADER from '@/shaders/oklch_visualizer.wgsl?url'

export class OklchVisualizerSketch implements SphereTracerSketch {
  shader_url: string = OKLCH_VISUALIZER_SHADER
  imports = [SHADER_LIBRARY.sdf3d, SHADER_LIBRARY.csg, SHADER_LIBRARY.srgb]
}
