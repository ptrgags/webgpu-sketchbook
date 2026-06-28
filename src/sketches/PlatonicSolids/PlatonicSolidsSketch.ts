import type { ShapeMachineSketch } from '@/machines/ShapeMachine.js'
import { TETRAHEDRON_GEOMETRY } from '@/meshes/Tetrahedron.js'
import SHADER from './platonic_solids.wgsl?url'
import { SHADER_LIBRARY } from '@/core/ShaderLibrary.js'
import { OCTAHEDRON_GEOMETRY } from '@/meshes/Octahedron.js'
import { DODECAHEDRON_GEOMETRY } from '@/meshes/Dodecahedron.js'
import { ICOSAHEDRON_GEOMETRY } from '@/meshes/Icosahedron.js'
import { encode_stl_file, mesh_to_triangle_soup } from '@/stl/encode_stl.js'
import { CUBE_GEOMETRY } from '@/meshes/Cube.js'
import { download_file } from '@/core/download_file.js'
import type { InputSystem } from '@/input/InputSystem.js'
import { CyclicCounter } from '@/core/CyclicCounter.js'
import { ReleaseSignal } from '@/input/ReleaseSignal.js'
import { TwoButtonAxis } from '@/input/TwoButtonAxis.js'
import type { AnalogSignal } from '@/input/Signal.js'
import { AnalogConst } from '@/input/const_signal.js'

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
    const decrement = new ReleaseSignal(input.keyboard.digital_key('ArrowLeft'))
    const increment = new ReleaseSignal(input.keyboard.digital_key('ArrowRight'))
    this.cycle_mesh = new TwoButtonAxis(decrement, increment)
  }

  update(time: number) {
    this.cycle_mesh.update(time)

    const places = this.cycle_mesh.value
    this.current_mesh.cycle(places)
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
