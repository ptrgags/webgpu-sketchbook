import { QuadUVMode, type QuadMachineSketch } from "@/machines/QuadMachine";
import COLOR_SPACES_SHADER from '@/shaders/color_spaces.wgsl?url';

export class ColorSpacesSketch implements QuadMachineSketch {
    uv_mode: QuadUVMode = QuadUVMode.Basic;
    shader_url: string = COLOR_SPACES_SHADER;
    fragment_entry = "fragment_main"
}