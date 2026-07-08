const MIDNIGHT: f32 = -0.5 * PI;

fn rotation(angle: f32) -> mat2x2f {
    return mat2x2f(
        cos(angle), sin(angle),
        -sin(angle), cos(angle)
    );
}

fn get_angle(uv: vec2f, rotation_angle: f32) -> f32 {
    let rotated = rotation(-rotation_angle) * uv;
    let signed = atan2(rotated.y, rotated.x) / PI;
    return 0.5 + 0.5 * signed;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let angle_hour = MIDNIGHT + get_analog(0) * TAU;
    let angle_min = MIDNIGHT + get_analog(1) * TAU;
    let angle_sec = MIDNIGHT + get_analog(2) * TAU;

    let hour_hand = get_angle(input.uv, -angle_hour);
    let min_hand = get_angle(input.uv, -angle_min);
    let sec_hand = get_angle(input.uv, -angle_sec);

    let color = vec3f(hour_hand, min_hand, sec_hand);
    return vec4f(color, 1.0);
}
