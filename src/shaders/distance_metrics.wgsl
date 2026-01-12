fn stripes(x: f32) -> f32 {
    let tenths = 10.0 * x % 1.0;
    return smoothstep(0.4, 0.5, tenths);
}

fn explerp(a: f32, b: f32, t: f32) -> f32 {
    return pow(a, (1.0 - t)) * pow(b, t);
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let uv = input.uv;

    let x_dist = abs(uv.x);
    let y_dist = abs(uv.y);

    const N_MIN: f32 = 10.0;
    const N_MAX: f32 = 1.0 / 10.0;

    // number from [-1, 1]
    let screen_x = get_analog(0);

    let n = explerp(N_MIN, N_MAX, 0.5 + 0.5 * screen_x);

    let x_sqr = pow(x_dist, n);
    let y_sqr = pow(y_dist, n);

    let sum_sqr = x_sqr + y_sqr;
    let mean = pow(sum_sqr, 1.0 / n);

    let color = vec3f(stripes(mean), 0.0, 0);
    return vec4f(color, 1.0);
}
