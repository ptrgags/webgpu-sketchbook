import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { CUBE_GEOMETRY } from '@/core/CubeGeometry.js'
import SHADER from './srgb_cube.wgsl?url'
import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'

export class SRGBCubeSketch implements ShapeMachineSketch {
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.constants]
  geometry = CUBE_GEOMETRY
}
