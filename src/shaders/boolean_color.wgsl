struct OklchGradient {
    start_color: vec3f,
    end_color: vec3f,
}

const OKLCH_PALETTES = array(
    OklchGradient(vec3f(0.0, 0.0, 0.0), vec3f(1.0, 0.0, 0.0)),
    OklchGradient(vec3f(0.7, 0.1, 0), vec3f(0.7, 0.1, 3.1415)),
    OklchGradient(vec3f(0.5, 0.1, 14.0), vec3f(0.5, 0.1, 14.0))
);

const GRADIENT_STEPS: f32 = 16.0;

fn handle_out_of_gamut(srgb: vec3f, default_color: vec3f) -> vec3f {
    let out_of_gamut = any(srgb < vec3f(0.0)) || any(srgb > vec3f(1.0));
    return select(srgb, default_color, out_of_gamut);
}

fn palette_lookup(gradient: OklchGradient, step: f32) -> vec3f {
    let t = step / (GRADIENT_STEPS - 1.0);
    let clamped_t = clamp(t, 0.0, 1.0);
    let color_oklch = mix(gradient.start_color, gradient.end_color, clamped_t);
    let color_srgb = oklab_to_linear_srgb(color_oklch);
    let fixed_color = handle_out_of_gamut(color_srgb, vec3f(0.5));
    return linear_to_srgb(fixed_color);
}


fn rect_mask(position: vec2f, dimensions: vec2f, uv: vec2f) -> f32 {
    let top_left = step(position, uv);
    let bottom_right = 1.0 - step(position + dimensions, uv);
    let masks = top_left * bottom_right;
    return masks.x * masks.y;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    var from_corner = (input.uv - vec2f(-1.0, 1.0)) / 2;
    from_corner.y = -from_corner.y;

    let grid_id = floor((GRADIENT_STEPS + 1) * from_corner);
    let a_step = grid_id.y - 1.0;
    let b_step = grid_id.x - 1.0;

    let a_swatches = palette_lookup(OKLCH_PALETTES[0], a_step);
    let b_swatches = palette_lookup(OKLCH_PALETTES[0], b_step);

    let mask_a = rect_mask(vec2f(0, 1), vec2f(1, 16), grid_id);
    let mask_b = rect_mask(vec2f(1, 0), vec2f(16, 1), grid_id);
    let mask_table = rect_mask(vec2f(1, 1), vec2f(16, 16), grid_id);

    // background layer
    var color = vec3f(0.0);
    color = mix(color, a_swatches, mask_a);
    color = mix(color, b_swatches, mask_b);
    color = mix(color, vec3f(1.0), mask_table);

    return vec4f(color, 1.0);
}