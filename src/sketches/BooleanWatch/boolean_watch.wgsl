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

    const BEZEL_OUTER_RADIUS = 0.7;
    const BEZEL_INNER_RADIUS = 0.55;
    const DROP_SHADOW_OFFSET = vec2f(0.075, -0.1);
    let bezel_bg_mask = 1.0 - step(0.0, sdf_circle(uv, BEZEL_OUTER_RADIUS));
    let drop_shadow_mask = 1.0 - step(0.0, sdf_circle(uv - DROP_SHADOW_OFFSET, BEZEL_OUTER_RADIUS));

    let dial_bg_mask = 1.0 - step(0.0, sdf_circle(uv, BEZEL_INNER_RADIUS));

    const RADIUS_HOUR = 0.25;
    const HOUR_HAND_THICKNESS = 0.015;
    const CENTER = vec2f(0.0);
    let hour_tip = RADIUS_HOUR * vec2f(cos(-angle_hour), sin(-angle_hour));
    let hour_hand = sdf_segment(uv, CENTER, hour_tip);
    let hour_hand_mask = 1.0 - step(HOUR_HAND_THICKNESS, hour_hand); 

    const RADIUS_MIN = 0.4;
    const MIN_HAND_THICKNESS = 0.01;
    let min_tip = RADIUS_MIN * vec2f(cos(-angle_min), sin(-angle_min));
    let min_hand = sdf_segment(uv, CENTER, min_tip);
    let min_hand_mask = 1.0 - step(MIN_HAND_THICKNESS, min_hand);

    const RADIUS_SEC = 0.5;
    const SEC_HAND_THICKNESS = 0.005;
    let sec_tip = RADIUS_SEC * vec2f(cos(-angle_sec), sin(-angle_sec));
    let sec_hand = sdf_segment(uv, CENTER, sec_tip);
    let sec_hand_mask = 1.0 - step(SEC_HAND_THICKNESS, sec_hand);

    const COLOR_DROP_SHADOW = vec3f(0.1);
    const COLOR_BEZEL = vec3f(0.4);
    const COLOR_DIAL = vec3f(0.8);
    const COLOR_HANDS = vec3f(1.0);
    var color = background;
    color = mix(color, COLOR_DROP_SHADOW, drop_shadow_mask);
    color = mix(color, COLOR_BEZEL, bezel_bg_mask);
    color = mix(color, COLOR_DIAL, dial_bg_mask);
    color = mix(color, COLOR_HANDS, hour_hand_mask);
    color = mix(color, COLOR_HANDS, min_hand_mask);
    color = mix(color, COLOR_HANDS, sec_hand_mask);


    return vec4f(color, 1.0);
}
