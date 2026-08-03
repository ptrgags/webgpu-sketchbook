import { ShapeMachine, type ShapeMachineSketch } from '../../machines/ShapeMachine.js'
import { TETRAHEDRON_GEOMETRY } from '../../meshes/Tetrahedron.js'
import SHADER from './platonic_solids.wgsl?url'
import { SHADER_LIBRARY } from '../../core/ShaderLibrary.js'
import { OCTAHEDRON_GEOMETRY } from '../../meshes/Octahedron.js'
import { DODECAHEDRON_GEOMETRY } from '../../meshes/Dodecahedron.js'
import { ICOSAHEDRON_GEOMETRY } from '../../meshes/Icosahedron.js'
import { encode_stl_file, mesh_to_triangle_soup } from '../../stl/encode_stl.js'
import { CUBE_GEOMETRY } from '../../meshes/Cube.js'
import { download_file } from '../../core/download_file.js'
import type { InputSystem } from '../../input/InputSystem.js'
import { CyclicCounter } from '../../core/CyclicCounter.js'
import { TwoButtonAxis } from '../../input/TwoButtonAxis.js'
import type { AnalogSignal } from '../../input/Signal.js'
import { AnalogConst } from '../../input/const_signal.js'
import { GamepadButtons } from '../../input/GamepadInput.js'
import { Vec2 } from '../../core/Vec2.js'
import { DigitalCascade } from '../../input/CascadeSignal.js'
import type { Machine } from '@/webgpu/Engine.js'

const PLATONIC_SOLIDS = [
  TETRAHEDRON_GEOMETRY,
  CUBE_GEOMETRY,
  OCTAHEDRON_GEOMETRY,
  DODECAHEDRON_GEOMETRY,
  ICOSAHEDRON_GEOMETRY
]

export class PlatonicSolidsSketch implements ShapeMachineSketch {
  shader_url: string = SHADER
  imports = [
    SHADER_LIBRARY.constants,
    SHADER_LIBRARY.camera,
    SHADER_LIBRARY.ortho,
    SHADER_LIBRARY.xforms
  ]
  meshes = PLATONIC_SOLIDS
  current_mesh = new CyclicCounter(0, PLATONIC_SOLIDS.length)

  cycle_mesh: AnalogSignal = new AnalogConst(0.0)

  configure_input(input: InputSystem) {
    const left_button = input.gamepad.digital_button(GamepadButtons.Left)
    const right_button = input.gamepad.digital_button(GamepadButtons.Right)

    const left_key = input.keyboard.digital_key('ArrowLeft')
    const right_key = input.keyboard.digital_key('ArrowRight')

    const VB_DIMENSIONS = new Vec2(0.3, 1.0)
    const left_vb = input.pointer.virtual_button(new Vec2(0, 0), VB_DIMENSIONS)
    const right_vb = input.pointer.virtual_button(new Vec2(1.0 - VB_DIMENSIONS.x, 0), VB_DIMENSIONS)

    const decrement_key = new DigitalCascade([left_button, left_key, left_vb])
    const increment_key = new DigitalCascade([right_button, right_key, right_vb])

    this.cycle_mesh = TwoButtonAxis.make_counter(decrement_key, increment_key)
  }

  update(time: number) {
    this.cycle_mesh.update(time)

    const places = this.cycle_mesh.value
    this.current_mesh.cycle(places)
  }

  static make_machine(): Machine {
    return new ShapeMachine(new PlatonicSolidsSketch())
  }
}

// @ts-ignore
window.download_models = () => {
  const tetra = encode_stl_file(mesh_to_triangle_soup(TETRAHEDRON_GEOMETRY), 'tetrahedron.stl')
  const hexa = encode_stl_file(mesh_to_triangle_soup(CUBE_GEOMETRY), 'cube.stl')
  const octa = encode_stl_file(mesh_to_triangle_soup(OCTAHEDRON_GEOMETRY), 'octahedron.stl')
  const dodeca = encode_stl_file(mesh_to_triangle_soup(DODECAHEDRON_GEOMETRY), 'dodecahedron.stl')
  const icosa = encode_stl_file(mesh_to_triangle_soup(ICOSAHEDRON_GEOMETRY), 'icosahedron.stl')

  download_file(tetra)
  download_file(hexa)
  download_file(octa)
  download_file(dodeca)
  download_file(icosa)
}
