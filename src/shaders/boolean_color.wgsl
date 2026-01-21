struct OklchGradient {
    start_color: vec3f,
    end_color: vec3f,
}

const OKLCH_PALETTES = array(
    OklchGradient(vec3f(0.7, 0.1, 0), vec3f(0.7, 0.1, radians(360))),
);

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {

    let t = 0.5 + 0.5 * input.uv.x;
    let color_oklch = mix(OKLCH_PALETTES[0].start_color, OKLCH_PALETTES[0].end_color, t);

    let color = linear_to_srgb(oklch_to_linear_srgb(color_oklch));
    return vec4f(color, 1.0);
}