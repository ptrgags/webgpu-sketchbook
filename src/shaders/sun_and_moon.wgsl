const PI: f32 = 3.1415926;

fn sdf_circle(p: vec2f, center: vec2f, radius: f32) -> f32 {
    let dist = length(p - center);
    return dist - radius;
}

fn sdf_subtract(dist_a: f32, dist_b: f32) -> f32 {
    return max(dist_a, -dist_b);
}

fn sdf_line(p: vec2f, normal: vec2f, distance: f32) -> f32 {
    // normal * p = distance
    return dot(p, normal) - distance;
}

fn sdf_rays(p: vec2f, n: f32, min_radius: f32, max_radius: f32) -> f32 {
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


@fragment
fn sun_and_moon(input: Interpolated) -> @location(0) vec4f {

    let moon_center = vec2f(sin(2.0 * u_frame.time), -0.5);

    const MOON_RADIUS: f32 = 0.3;
    const MOON_CENTER: vec2f = vec2f(0.0, -0.5);
    const MOON_CUTOUT_RADIUS: f32 = 0.2;
    let moon_outer = sdf_circle(input.uv, moon_center, MOON_RADIUS);
    let moon_cutout = sdf_circle(input.uv, moon_center + vec2f(-0.5 * MOON_RADIUS, 0.0), MOON_CUTOUT_RADIUS);

    let moon = sdf_subtract(moon_outer, moon_cutout);
    let moon_mask = smoothstep(0.0, 0.01, moon);
    //let moon_mask = step(0.0, moon);

    let sun_center = vec2f(u_frame.time % 2.0 - 1.0, 0.5);
    const SUN_CENTER: vec2f = vec2f(0.0, 0.5);
    const SUN_CENTER_RADIUS: f32 = 0.2;

    let sun_middle = sdf_circle(input.uv, sun_center, SUN_CENTER_RADIUS);
    let sun_rays = sdf_rays(input.uv - sun_center, 6.0, 0.3, 0.31);
    let sun = sun_rays;
    let sun_mask = smoothstep(0.0, 0.01, sun_rays);

    let sun_is_closer = f32(sun < moon);
    let color = mix(vec3f(0.5, 0.0, 1.0), vec3f(1.0, 0.5, 0.0), sun_is_closer);

    let mask = moon_mask * sun_mask;

    // 2 * radius = diameter of moon
    // 2 * cutout radius = diameter
    // moon center - moon radius = left of moon
    // moon center - moon radius + cutout radius = center of cutout

    //let color = moon_mask * vec3f(0.5, 0.0, 1.0);
    //let color = sun_mask * vec3f(1.0, 0.5, 0.0);

    return vec4f(mask * color, 1.0);
}