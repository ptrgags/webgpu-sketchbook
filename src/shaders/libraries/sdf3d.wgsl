// SDFs from https://iquilezles.org/articles/distfunctions/
// 
// However, I'm adding more notes and intermediate variables to document
// my understanding of how this math works.

// Simpler calculation for a plane in the xy-direction at the given height
// relative to the origin
fn sdf_ground_plane(p: vec3f, height: f32) -> f32 {
    return p.y - height;
}

fn sdf_plane(p: vec3f, normal: vec3f) -> f32 {
    return dot(p, normal);
}

fn sdf_sphere(p: vec3f, radius: f32) -> f32 {
    return length(p) - radius;
}

fn sdf_cylinder(p: vec3f, dimensions_cyl: vec2f) -> f32 {
    // Fold space up via absolute cylindrical coordinates (s, z) so
    // we have a 2d slice
    let folded = vec2f(length(p.xz), abs(p.y));

    // vector relative to the "corner" of the cyllinder (circumference of cap)
    let from_corner = folded - dimensions_cyl;

    // The SDF is different inside/outside, so clamp each one to 0 and
    // glue them together at the end 
    //
    // Inside the cylinder, we get right-angled isosurfaces (smaller cylinders)
    let inner = min(max(from_corner.x, from_corner.y), 0.0);
    // Outside the cylinder, the isosurfaces curve around the corner
    let outer = length(max(from_corner, vec2(0.0)));
    return inner + outer;
}