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

fn sdf_box(p: vec3f, radii: vec3f) -> f32 {
    // Fold space so we only have to
    // examine one octant
    let folded = abs(p);

    let from_corner = folded - radii;

    // The SDF is different for inside/outside, so clamp each one to 0 and 
    // glue together.
    // see also https://www.desmos.com/calculator/huaoviuheu
    let max_component = max(from_corner.x, max(from_corner.y, from_corner.z));
    let inner = min(max_component, 0.0);
    let outer = length(max(from_corner, vec3f(0.0)));
    return inner + outer;
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
    let outer = length(max(from_corner, vec2f(0.0)));
    return inner + outer;
}

/**
 * Cone with _vertex_ at the origin.
 *
 * dimensions_cyl is the (radius, height) of the bounding cylinder. The cone
 * opens downwards unless height is negative
 */
fn sdf_cone(p: vec3f, dimensions_cyl: vec2f) -> f32 {
    let bottom_corner = vec2f(dimensions_cyl.x, -dimensions_cyl.y);
    let cylindrical = vec2f(length(p.xz), p.y);

    // Project onto the sloped side of the cone, but clamp to have length in [0, 1]
    let projected_side = bottom_corner * clamp(dot(cylindrical, bottom_corner)/dot(bottom_corner, bottom_corner), 0.0, 1.0); 
    let from_side = cylindrical - projected_side;

    // Similar but for the bottom of the cone
    let projected_bottom = bottom_corner * vec2(clamp(cylindrical.x / bottom_corner.x, 0, 1), 1.0);
    let from_bottom = cylindrical - projected_bottom;

    let unsigned_dist = sqrt(min(dot(from_side, from_side), dot(from_bottom, from_bottom)));

    // Usually -1 unless the dimensions for some reason were negative;
    let open_direction = sign(bottom_corner.y);

    // Determine if the point is inside or outside the cone by using a wedge
    // product of the point and each edge.
    //
    // Magnitude of (cylindrical wedge bottom_corner)
    let inside_side = open_direction * (cylindrical.x * bottom_corner.y - cylindrical.y * bottom_corner.x);
    // axis-aligned so we can just use subtraction
    let inside_bottom = open_direction * (cylindrical.y - bottom_corner.y);
    let leading_sign = sign(max(inside_side, inside_bottom));

    return leading_sign * unsigned_dist;

}