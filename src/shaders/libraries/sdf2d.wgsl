fn sdf_point(p: vec2f) -> f32 {
    return length(p);
}

fn sdf_circle(p: vec2f, radius: f32) -> f32 {
    let dist = length(p);
    return dist - radius;
}

fn sdf_line(p: vec2f, normal: vec2f, distance: f32) -> f32 {
    return dot(p, normal) - distance;
}

fn sdf_segment(p: vec2f, a: vec2f, b: vec2f) -> f32 {
    // Based on iq's formula https://iquilezles.org/articles/distfunctions2d/
    // the YouTube video linked there (https://www.youtube.com/watch?v=PMltMdi1Wzg) is great!
    
    // measure relative to the start point
    let from_a = p - a;
    // vector along the line segment
    let ab = b - a;

    // project the point onto the line. Then clamp it between 0.0 and 1.0
    // this produces a lerp factor from a to b so I'm calling it t instead
    // of h
    let proj = dot(from_a, ab)/dot(ab, ab);
    let t = clamp(proj, 0.0, 1.0);

    // the nearest point on the line is
    // q = a + t * (b - a)
    // we want the distance between p and q
    // |p - q| = p - a - t * (b - a)
    return length(from_a - t * ab);
}
