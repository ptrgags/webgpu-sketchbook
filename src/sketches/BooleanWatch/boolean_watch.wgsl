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
    let angle_hour = get_analog(0);
    let angle_min = get_analog(1);
    let angle_sec = get_analog(2);

    let hour_hand = get_angle(input.uv, -angle_hour - 0.5 * PI);
    let min_hand = get_angle(input.uv, -angle_min - 0.5 * PI);
    let sec_hand = get_angle(input.uv, -angle_sec - 0.5 * PI);

    let color = vec3f(hour_hand, min_hand, sec_hand);
    return vec4f(color, 1.0);
}
