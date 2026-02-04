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
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    // Make the coordinates run from [-4, 4] horizontally
    let scaled = input.uv * 3.0;
    let cell_uv = fract(scaled);

    // [-1, 1] within the cell
    let from_center: vec2f = 2.0 * (cell_uv - 0.5);

    let border_mask = step(0.95, max2(from_center));

    const FEATHER_AMOUNT: f32 = 0.01;
    const EYE_RADIUS: f32 = 0.5;
    let sclera_mask = circle_mask(from_center, EYE_RADIUS, FEATHER_AMOUNT);
    
    let dir = vec2f(get_analog(0), get_analog(1));

    var gaze = dir;
    if (dot(dir, dir) > 0) {
        gaze = normalize(gaze);
    }

    // Eyelid close position, a little below the center line
    const LID_CLOSE: f32 = -0.1;
    let from_close = abs(from_center.y - LID_CLOSE);
    let blink = get_analog(2);
    let eyelid_mask = step(1.0 - blink, from_close);

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
    color = mix(color, vec3f(156.0, 120.0, 79.0) / 255.0, eyelid_mask * sclera_mask);

    return vec4f(color, 1.0);
}
