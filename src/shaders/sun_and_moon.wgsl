const PI: f32 = 3.1415926;

fn sdf_circle(p: vec2f, radius: f32) -> f32 {
    let dist = length(p);
    return dist - radius;
}

fn sdf_subtract(dist_a: f32, dist_b: f32) -> f32 {
    return max(dist_a, -dist_b);
}

fn sdf_line(p: vec2f, normal: vec2f, distance: f32) -> f32 {
    // normal * p = distance
    return dot(p, normal) - distance;
}

fn sdf_rays(p: vec2f, n: f32) -> f32 {
    let r = length(p);
    let theta = atan2(p.y, p.x);


    // remap from [-pi, pi] to [0, 1]. It starts on the left end of the unit
    // circle but that doesn't matter here.
    let remapped_theta = 0.5 * theta / PI + 0.5;

    let angle_cells = modf(2.0 * n * remapped_theta);
    let mirrored_theta = mix(angle_cells.fract, 1.0 - angle_cells.fract, angle_cells.whole % 2.0);

    let point = vec2f(r, r * sin(mirrored_theta));

    let normal1 = vec2f(1.0, 1.0);

    let pointy = sdf_line(point, normal1, 0.5);

    return pointy;
}

fn rotate(theta: f32) -> mat2x2f {
    let c = cos(theta);
    let s = sin(theta);
    return mat2x2f(
        c, s,
        -s, c,
    );
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    const SMOOTH_RADIUS = 0.01;

    const MOON_RADIUS: f32 = 0.3;
    const MOON_CENTER: vec2f = vec2f(0.0, -0.5);
    const MOON_CUTOUT_RADIUS: f32 = 0.2;

    // Slow down time a little bit
    let t = 0.2 * u_frame.time;

    // Make a crescent moon shape that bobs up and down.
    let moon_center = vec2f(0.0, 0.45 * sin(2.0 * PI * t) - 0.5);
    let moon_cutout_center = moon_center + vec2f(0.0, 0.5 * MOON_RADIUS);

    let moon_outer = sdf_circle(input.uv - moon_center, MOON_RADIUS);
    let moon_cutout = sdf_circle(input.uv - moon_cutout_center, MOON_CUTOUT_RADIUS);

    let moon = sdf_subtract(moon_outer, moon_cutout);
    let moon_mask = smoothstep(-0.5 * SMOOTH_RADIUS, 0.5 * SMOOTH_RADIUS, moon);
    
    const SUN_CENTER: vec2f = vec2f(0.0, 0.5);
    const SUN_CENTER_RADIUS: f32 = 0.1;
    const SUN_POINTS: f32 = 7.0;

    // Rotate the sun in sync with the bobing moon, so the mouth of the crescent will
    // surround the next point of the sun without 
    let sun_rotation = rotate(2.0 * PI * t / SUN_POINTS);
    let sun_middle = sdf_circle(input.uv - SUN_CENTER, SUN_CENTER_RADIUS);
    let sun = sdf_rays(sun_rotation * (input.uv - SUN_CENTER), SUN_POINTS);
    let sun_mask = smoothstep(-SMOOTH_RADIUS, SMOOTH_RADIUS, sun);

    // For a full voronoi diagram, this would be finding the minimum distance,
    // but in this case we only have the two distance values. Use smoothstep
    let sun_is_closer = smoothstep(-SMOOTH_RADIUS, SMOOTH_RADIUS, sun - moon);
    let mask = 1.0 - moon_mask * sun_mask;

    // Both the sun and moon will be the same light yellow color. The moon is
    // on a purple background, the sun on a blue background
    const COLOR_DAY: vec3f = vec3f(73, 154, 223) / 255.0;
    const COLOR_NIGHT: vec3f = vec3f(80, 42, 121) / 255.0;
    const COLOR_SUN_AND_MOON: vec3f = vec3f(248, 241, 134) / 255.0;
    var color = mix(COLOR_NIGHT, COLOR_DAY, sun_is_closer);
    color = mix(color, COLOR_SUN_AND_MOON, mask);

    return vec4f(color, 1.0);
}