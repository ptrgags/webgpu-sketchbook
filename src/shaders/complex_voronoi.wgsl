// Based on sdSegment in https://iquilezles.org/articles/distfunctions2d/
fn sdf_segment(point: vec2f, a: vec2f, b: vec2f) -> f32 {
    let along_segment = b - a;
    let from_start = point - a;
    let projection = dot(from_start, along_segment) / dot(along_segment, along_segment);
    let nearest_t = clamp(projection, 0.0, 1.0);
    return length(from_start - nearest_t * along_segment);
}

@fragment
fn voronoi_main(input: Interpolated) -> @location(0) vec4f {
    let a = vec2f(0.25, 0.25);
    let b = vec2f(0.25, 0.75);

    let dist1 = sdf_segment(input.uv, a, b);

    let t = fract(0.1 * u_frame.time);

    let c = vec2f(0.5, 0.5);
    let d = vec2f(0.3, 0.4);
    let dist2 = sdf_segment(input.uv, c, d);

    let nearest = step(0, dist2 - dist1);

    let color = mix(vec3f(1.0, 0.0, 0.0), vec3f(1.0, 0.5, 0.0), nearest);

    let combined = min(dist1, dist2);
    let mask = step(0.01, combined);

    return vec4f(mask * color, 1.0);
}
