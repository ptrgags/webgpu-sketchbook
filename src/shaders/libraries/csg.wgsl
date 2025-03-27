// Constructive Solid Geometry (CSG) functions for SDFs

fn sdf_union(a: f32, b: f32) -> f32 {
    return min(a, b);
}

fn sdf_intersect(a: f32, b: f32) -> f32 {
    return max(a, b);
}

fn sdf_subtract(a: f32, b: f32) -> f32 {
    // A - B = A intersect complement(B)
    return max(a, -b);
}