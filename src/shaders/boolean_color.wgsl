struct OklchGradient {
    start_color: vec3f,
    end_color: vec3f,
}

const OKLCH_PALETTES = array(
    OklchGradient(vec3f(0.0, 0.0, 0.0), vec3f(1.0, 0.0, 0.0)),
    OklchGradient(vec3f(0.7, 0.1, 0), vec3f(0.7, 0.1, radians(360))),
);

const GRADIENT_STEPS: f32 = 16.0;

fn palette_lookup(gradient: OklchGradient, step: f32) -> vec3f {
    let t = step / (GRADIENT_STEPS - 1.0);
    let color_oklch = mix(gradient.start_color, gradient.end_color, t);
    return linear_to_srgb(oklab_to_linear_srgb(color_oklch));
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    var from_corner = (input.uv - vec2f(-1.0, 1.0)) / 2;
    from_corner.y = -from_corner.y;

    let grid_id = floor((GRADIENT_STEPS + 1) * from_corner);

    let color = palette_lookup(OKLCH_PALETTES[0], grid_id.x - 1);
    return vec4f(color, 1.0);
}