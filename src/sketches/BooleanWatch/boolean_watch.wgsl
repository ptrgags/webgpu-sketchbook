const MIDNIGHT: f32 = -0.5 * PI;

fn rotation(angle: f32) -> mat2x2f {
    return mat2x2f(
        cos(angle), sin(angle),
        -sin(angle), cos(angle)
    );
}

fn conical_gradient(uv: vec2f, rotation_angle: f32) -> f32 {
    let rotated = rotation(-rotation_angle) * uv;
    let signed = atan2(rotated.y, rotated.x) / PI;
    return 0.5 + 0.5 * signed;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let angle_hour = MIDNIGHT + get_analog(0) * TAU;
    let angle_min = MIDNIGHT + get_analog(1) * TAU;
    let angle_sec = MIDNIGHT + get_analog(2) * TAU;
    let uv = input.uv;


    let hour_gradient = conical_gradient(uv, -angle_hour);
    let min_gradient = conical_gradient(uv, -angle_min);
    let sec_gradient = conical_gradient(uv, -angle_sec);

    let bg_uv = fract(uv);
    let background = bitwise_color(
        bg_uv.x * vec3f(1.0), 
        bg_uv.y * vec3f(1.0), 
        OP_NAND);

    const BEZEL_OUTER_RADIUS = 0.4;
    const BEZEL_INNER_RADIUS = 0.3;
    const DROP_SHADOW_OFFSET = vec2f(0.075, -0.1);
    let bezel_bg_mask = 1.0 - step(BEZEL_OUTER_RADIUS, sdf_circle(uv, BEZEL_OUTER_RADIUS));
    let drop_shadow_mask = 1.0 - step(BEZEL_OUTER_RADIUS, sdf_circle(uv - DROP_SHADOW_OFFSET, BEZEL_OUTER_RADIUS));

    let dial_bg_mask = 1.0 - step(BEZEL_INNER_RADIUS, sdf_circle(uv, BEZEL_INNER_RADIUS));

    const COLOR_DROP_SHADOW = vec3f(0.1);
    const COLOR_BEZEL = vec3f(0.4);
    const COLOR_DIAL = vec3f(0.8);
    var color = background;
    color = mix(color, COLOR_DROP_SHADOW, drop_shadow_mask);
    color = mix(color, COLOR_BEZEL, bezel_bg_mask);
    color = mix(color, COLOR_DIAL, dial_bg_mask);


    return vec4f(color, 1.0);
}
