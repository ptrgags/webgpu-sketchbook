import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { TETRAHEDRON_GEOMETRY } from '@/meshes/Tetrahedron.js'
import SHADER from './platonic_solids.wgsl?url'
import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'

export class PlatonicSolidsSketch implements ShapeMachineSketch {
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.constants,
    SHADER_LIBRARY.camera,
    SHADER_LIBRARY.ortho,
    SHADER_LIBRARY.xforms
  ]
  geometry = TETRAHEDRON_GEOMETRY
}
