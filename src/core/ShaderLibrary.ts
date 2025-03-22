import QUAD_MACHINE_SHADER from '@/shaders/machines/quad_machine.wgsl?url'
import SDF3D_SHADER from '@/shaders/libraries/sdf3d.wgsl?url'
import SRGB_SHADER from '@/shaders/libraries/srgb.wgsl?url'
import SPHERE_TRACER_MACHINE_SHADER from '@/shaders/machines/sphere_tracer_machine.wgsl?url'
import { fetch_text } from './fetch_text';

export class LazyShader {
    url: string;
    wgsl?: string;
    fetch_promise?: Promise<string>

    constructor(url: string) {
        this.url = url;
    }

    async fetch_wgsl(): Promise<string> {
        // we have a result
        if (this.wgsl !== undefined) {
            return this.wgsl
        }

        if (this.fetch_promise === undefined) {
            this.fetch_promise = fetch_text(this.url)
                .then(wgsl => this.wgsl = wgsl);
        }

        return await this.fetch_promise
    }
}

// Machines will use these shaders internally
export const MACHINE_LIBRARY = {
    quad: new LazyShader(QUAD_MACHINE_SHADER),
    sphere_tracer: new LazyShader(SPHERE_TRACER_MACHINE_SHADER),
}

// Shader libraries that can be manually imported by a sketch
export const SHADER_LIBRARY = {
    sdf3d: new LazyShader(SDF3D_SHADER),
    srgb: new LazyShader(SRGB_SHADER)
}