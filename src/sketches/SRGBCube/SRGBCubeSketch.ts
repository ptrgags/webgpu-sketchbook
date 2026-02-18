import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { CUBE_GEOMETRY } from '@/core/CubeGeometry.js'
import SHADER from './srgb_cube.wgsl?url'

export class SRGBCubeSketch implements ShapeMachineSketch {
  shader_url: string = SHADER
  imports = []
  geometry = CUBE_GEOMETRY
}
