fn srgb_to_linear(srgb: vec3f) -> vec3f {
    const GAMMA: vec3f = vec3f(2.2);
    return pow(srgb, GAMMA);
}

fn linear_to_srgb(linear: vec3f) -> vec3f {
    const GAMMA: vec3f = vec3f(1.0 / 2.2);
    return pow(linear, GAMMA);
}