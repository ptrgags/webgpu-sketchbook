import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { CUBE_GEOMETRY } from '@/core/CubeGeometry.js'
import SHADER from './srgb_cube.wgsl?url'
import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'

export class SRGBCubeSketch implements ShapeMachineSketch {
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.constants,
    SHADER_LIBRARY.camera,
    SHADER_LIBRARY.ortho,
    SHADER_LIBRARY.xforms
  ]
  geometry = CUBE_GEOMETRY
}
