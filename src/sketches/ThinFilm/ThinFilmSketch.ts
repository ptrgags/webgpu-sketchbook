import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { CUBE_GEOMETRY } from '@/meshes/CubeGeometry.js'
import SHADER from './thin_film.wgsl?url'
import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'

export class ThinFilmSketch implements ShapeMachineSketch {
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.constants,
    SHADER_LIBRARY.camera,
    SHADER_LIBRARY.ortho,
    SHADER_LIBRARY.xforms,
    SHADER_LIBRARY.thin_film
  ]
  geometry = CUBE_GEOMETRY
}
