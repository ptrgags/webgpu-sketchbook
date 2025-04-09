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
