import { SHADER_LIBRARY } from '@/core/ShaderLibrary'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import SHADER from './thin_film_chart.wgsl?url'

export class ThinFilmChartSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  shader_url: string = SHADER
  imports = [SHADER_LIBRARY.constants, SHADER_LIBRARY.srgb, SHADER_LIBRARY.thin_film]
}
