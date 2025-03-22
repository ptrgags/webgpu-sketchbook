fn sdf_plane(p: vec3f, normal: vec3f) -> f32 {
    return dot(p, normal);
}

fn sdf_sphere(p: vec3f, radius: f32) -> f32 {
    return length(p) - radius;
}