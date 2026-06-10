import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { TETRAHEDRON_GEOMETRY } from '@/meshes/Tetrahedron.js'
import SHADER from './platonic_solids.wgsl?url'
import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'
import { OCTAHEDRON_GEOMETRY } from '@/meshes/Octahedron.js'
import { DODECAHEDRON_GEOMETRY } from '@/meshes/Dodecahedron.js'
import { ICOSAHEDRON_GEOMETRY } from '@/meshes/Icosahedron.js'

export class PlatonicSolidsSketch implements ShapeMachineSketch {
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.constants,
    SHADER_LIBRARY.camera,
    SHADER_LIBRARY.ortho,
    SHADER_LIBRARY.xforms
  ]
  // TODO: How to switch geometry on the fly?
  geometry = ICOSAHEDRON_GEOMETRY
}
