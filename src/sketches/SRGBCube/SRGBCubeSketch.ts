import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { CUBE_GEOMETRY } from '@/meshes/Cube.js'
import SHADER from './srgb_cube.wgsl?url'
import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'
import { CyclicCounter } from '@/core/CyclicCounter.js'
import type { InputSystem } from '@/input/InputSystem.js'

export class SRGBCubeSketch implements ShapeMachineSketch {
  configure_input?: ((input: InputSystem) => void) | undefined
  update?: ((time: number) => void) | undefined
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.constants,
    SHADER_LIBRARY.camera,
    SHADER_LIBRARY.ortho,
    SHADER_LIBRARY.xforms
  ]
  meshes = [CUBE_GEOMETRY]
  current_mesh = CyclicCounter.CONSTANT
}
