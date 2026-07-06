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

/**
 * convert spiral coordinates to polar coordinates
 * 
 * spiral - (t, theta) where t blends between revolutions of the spiral (in 
 *     logarithmic units for base k) and theta is an angle in [0, 2pi) 
 *    
 * returns (r, theta), the polar coordinates for the point. theta does not change.
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
    return vec2f(r, theta);
}

/**
 * Inverse of spiral_to_polar()
 *
 * polar - (r, theta) coordinates of a point in the plane
 * 
 * returns (t, theta) where t is in (-inf, inf) and theta is unchanged
 */
fn polar_to_spiral(polar: vec2f, k: f32) -> vec2f {
    let r = polar.x;
    let theta = polar.y;
    let spiral_r = log_spiral(theta, k);
    let t = (log(r) - log(spiral_r)) / log(k);
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
    let angle = -u_frame.time * 2.0 * PI * 0.1;
    let rot = mat2x2f(
        cos(angle), sin(angle),
        -sin(angle), cos(angle)
    );
    let p = rot * input.uv;


    let dist_r = sdf_spiral(p, 4.0);
    let mask = 1.0 - step(0.4, dist_r);

    let polar = rect_to_polar(p);
    let n = 12.0;
    let theta = polar.y / (2.0 * PI) + floor(polar.x);
    let theta_cell = fract(n * theta);

    let color = mask * vec3f(theta_cell, dist_r, 1.0);
    return vec4f(color, 1.0);
}
