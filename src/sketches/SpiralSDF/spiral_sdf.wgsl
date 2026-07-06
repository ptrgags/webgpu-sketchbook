/**
 * Compute polar coordinates
 *
 * rect - (x, y) coordinates
 *
 * returns (r, theta) polar coordinates. 
 *
 * IMPORTANT: Theta is adjusted to [0, 2pi)
 */
fn rect_to_polar(rect: vec2f) -> vec2f {
    let r = length(rect);
    let theta = atan2(-rect.y, -rect.x) + PI;
    return vec2f(r, theta);
}

/**
 * Compute rectangular coordinates
 *
 * polar - (r, theta) coordinates. Theta must be in radians
 *
 * returns (x, y) coordinates
 */
fn polar_to_rect(polar: vec2f) -> vec2f {
    let r = polar.x;
    let theta = polar.y;
    return vec2f(r * cos(theta), r * sin(theta));
}


/**
 * A logarithmic spiral is the polar equation
 * r = s(theta) = k^(theta / 2pi)
 *
 * theta - polar angle in radians
 * k - scale factor applied to the radius every full turn. For example,
 *    the point (1, 0) gets sent to (k, 2pi)
 *
 * returns the radius of the point on the log spiral
 */
fn log_spiral(theta: f32, k: f32) -> f32 {
    let t = theta / (2.0 * PI);
    return pow(k, t);
}

fn modulo(x: f32, modulus: f32) -> f32 {
    return ((x % modulus) + modulus) % modulus;
}

/**
 * convert spiral coordinates to polar coordinates
 * 
 * spiral - (t, theta) where t blends between revolutions of the spiral (in 
 *     logarithmic units for base k) and theta is the corresponding angle. Both
 *     values are in (-inf, inf)
 *    
 * returns (r, theta), the polar coordinates for the point. Theta is reduced to be [0, 2pi)
 */
fn spiral_to_polar(spiral: vec2f, k: f32) -> vec2f {
    let t = spiral.x;
    let theta = spiral.y;
    // theta is in [0, 2pi) so log_spiral(theta, k) returns the radius
    // of the point on the spiral in the first revolution around the origin
    // (starting at 1)
    //
    // t is a log unit that determines how many revolutions away from the first
    // one the point is at
    let r = pow(k, t) * log_spiral(theta, k);
    let theta_reduced = modulo(theta, 2.0 * PI);
    return vec2f(r, theta_reduced);
}

/**
 * Inverse of spiral_to_polar()
 *
 * polar - (r, theta_reduced) coordinates of a point in the plane where
 *    theta_reduced is the angle in [0, 2pi)
 * 
 * returns (t, theta) where t is in (-inf, inf) and theta is the angle
 *    adjusted to the appropirate branch for the t value (i.e. theta_reduced + 2pi l for some l value)
 */
fn polar_to_spiral(polar: vec2f, k: f32) -> vec2f {
    let r = polar.x;
    let theta_reduced = polar.y;
    let spiral_r = log_spiral(theta_reduced, k);
    let t = (log(r) - log(spiral_r)) / log(k);
    let theta = theta_reduced + 2.0 * PI * floor(t);
    return vec2f(t, theta);
}

fn sdf_spiral(p: vec2f, k: f32) -> f32 {
    let polar = rect_to_polar(p);
    let spiral = polar_to_spiral(polar, k);

    let revolution = floor(spiral.x);
    let t = fract(spiral.x);

    let dist_normalized = 1.0 - 2.0 * abs(t - 0.5);
    return dist_normalized;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let angle = u_frame.time * 2.0 * PI * 0.1;
    let rot = mat2x2f(
        cos(angle), sin(angle),
        -sin(angle), cos(angle)
    );
    let p = 2.0 * rot * input.uv;


    let k = 2.0;
    let polar = rect_to_polar(p);
    let spiral = polar_to_spiral(polar, k);

    let n = 12.0;
    let grid = spiral * vec2f(1.0, n / (2.0 * PI));
    let cell_id = floor(grid);
    let cell_uv = fract(grid);

    let dist_center = 2.0 * abs(cell_uv - 0.5);
    let dist = max(dist_center.x, dist_center.y);

    let border = step(0.8, dist);

    let gradient_scale = 40.0;
    let gradient_along = spiral.y / gradient_scale + 0.5;

    let color = gradient_along * mix(vec3f(0.25, 0.75, 1.0), vec3f(1.0, 0.5, 0.0), border);
    return vec4f(color, 1.0);
}
