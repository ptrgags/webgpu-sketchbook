import { QuadUVMode, type QuadMachineSketch } from "@/machines/QuadMachine"
import SUN_AND_MOON_SHADER from '@/shaders/sun_and_moon.wgsl?url'

export class SunAndMoonSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = SUN_AND_MOON_SHADER
  fragment_entry? = 'sun_and_moon'
}