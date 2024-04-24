fn max2(v: vec2f) -> f32 {
    return max(v.x, v.y);
}

fn direction(angle_radians: f32) -> vec2f {
    return vec2f(cos(angle_radians), sin(angle_radians));
}

fn circle_mask(uv: vec2f, radius: f32, feather: f32) -> f32 {
    return smoothstep(radius + feather, radius - feather, length(uv));
}

@fragment
fn eyes_main(input: Interpolated) -> @location(0) vec4f {
    // Make the coordinates run from [-4, 4] horizontally
    let scaled = input.uv * 3.0;
    let cell_uv = fract(scaled);

    // [-1, 1] within the cell
    let from_center: vec2f = 2.0 * (cell_uv - 0.5);

    let border_mask = step(0.95, max2(from_center));

    const FEATHER_AMOUNT: f32 = 0.01;
    const EYE_RADIUS: f32 = 0.5;
    let sclera_mask = circle_mask(from_center, EYE_RADIUS, FEATHER_AMOUNT);
    
    let angle = radians(45.0);
    let gaze = direction(angle + u_frame.time);

    const IRIS_RADIUS = 0.4;
    let iris_center = (EYE_RADIUS - IRIS_RADIUS) * gaze;
    let iris_mask = circle_mask(from_center - iris_center, IRIS_RADIUS, FEATHER_AMOUNT);

    const PUPIL_RADIUS = 0.25;
    let pupil_center = (EYE_RADIUS - PUPIL_RADIUS) * gaze;
    let pupil_mask = circle_mask(from_center - pupil_center, PUPIL_RADIUS, FEATHER_AMOUNT);

    var color = vec3f(0.0);
    color = mix(color, vec3f(1.0, 0.0, 0.0), border_mask);
    color = mix(color, vec3f(1.0), sclera_mask);
    color = mix(color, vec3f(0.2, 0.35, 0.2), iris_mask);
    color = mix(color, vec3f(0.0), pupil_mask);

    return vec4f(color, 1.0);
}
