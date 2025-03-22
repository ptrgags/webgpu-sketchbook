import { QuadUVMode, type QuadMachineSketch } from "@/machines/QuadMachine";
import RAYMARCH_SHADER from '@/shaders/raymarch.wgsl?url'

export class RaymarchSketch implements QuadMachineSketch {
    uv_mode: QuadUVMode = QuadUVMode.Centered
    shader_url: string = RAYMARCH_SHADER
}