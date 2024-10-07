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

    let c = vec2f(0.5 + 0.2 * sin(t), 0.5 + 0.2 * sin(4.0 * t));
    let d = vec2f(0.3, 0.4);
    let dist2 = sdf_segment(input.uv, c, d);

    //let e = vec2f(0.4, 0.5);
    //let f = vec2f(0.3, 0.6);
    let e = vec2f(0.4, 0.6);
    let f = vec2f(0.5, 0.65 + 0.1 * sin(2.0 * t));
    let dist3 = sdf_segment(input.uv, e, f);

    var min_dist = 10.0;
    var index = 0;
    if dist1 < min_dist {
        min_dist = min(min_dist, dist1);
        index = 0;
    }

    if dist2 < min_dist {
        min_dist = min(min_dist, dist2);
        index = 1;
    }

    if dist3 < min_dist {
        min_dist = min(min_dist, dist3);
        index = 2;
    }

    let combined = min(min(dist1, dist2), dist3);
    let mask = 1.0 - smoothstep(0.01, 0.011, combined);

    var color = vec3f(0.0);
    color = mix(color, vec3f(1.0, 0.0, 0.0), f32(index == 0));
    color = mix(color, vec3f(1.0, 0.5, 0.0), f32(index == 1));
    color = mix(color, vec3f(0.0, 0.5, 1.0), f32(index == 2));
    color = mix(color, vec3f(0.0), mask);
    return vec4f(color, 1.0);
}
