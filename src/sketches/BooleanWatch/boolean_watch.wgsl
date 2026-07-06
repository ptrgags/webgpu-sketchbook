fn rotation(angle: f32) -> mat2x2f {
    return mat2x2f(
        cos(angle), sin(angle),
        -sin(angle), cos(angle)
    );
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {

    let t = u_frame.time;
    let freq = 0.5;

    let uv = rotation(-2.0 * PI * freq * t) * input.uv;
    let angle = atan2(uv.y, uv.x) + PI;
    

    let color = vec3f(angle / (2.0 * PI), 0.0, 0.0);
    return vec4f(color, 1.0);
}
