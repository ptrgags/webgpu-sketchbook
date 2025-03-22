fn sdf_plane(p: vec3f, normal: vec3f) -> f32 {
    return dot(p, normal);
}

fn sdf_sphere(p: vec3f, radius: f32) -> f32 {
    return length(p) - radius;
}

fn sdf_union(a: f32, b: f32) -> f32 {
    return min(a, b);
}


struct Ray {
    start: vec3f,
    dir: vec3f,
}

struct RaymarchResult {
    iteration_scale: f32,
    hit_position: vec3f,
    normal: vec3f,
}

fn compute_normal(position: vec3f) -> vec3f {
    // See https://youtu.be/PGtv-dBi2wE?si=rAWVJZG1WXlrXrfT
    const EPSILON: vec2f = vec2f(0.01, 0.0);
    let dist = scene(position);
    let n = dist - vec3f(
        scene(position - EPSILON.xyy),
        scene(position - EPSILON.yxy),
        scene(position - EPSILON.yyx),
    );
    return normalize(n);
}

fn raymarch(ray: Ray) -> RaymarchResult {
    const MAX_ITERATIONS: u32 = 100;
    const MIN_DIST: f32 = 0.001;
    const MAX_DIST: f32 = 100.0;
    var t = 0.0;
    var position = ray.start;

    for (var i = 0u; i < MAX_ITERATIONS; i++) {
        // We shot into space
        if (t > MAX_DIST) {
            break;
        }

        let dist = scene(position);

        if (dist < MIN_DIST) {
            return RaymarchResult(f32(i) / f32(MAX_ITERATIONS), position, compute_normal(position));
        }

        // We're clear to move the given distance to get closer to the surface
        t += dist;
        position = ray.start + t * ray.dir;
    }

    // We didn't hit anything
    return RaymarchResult(1.0, position, vec3f(0.0, 0.0, -1.0));
}

fn raymarch_shadow(ray: Ray) -> f32 {
    const MAX_ITERATIONS: u32 = 100;
    const MIN_DIST: f32 = 0.001;
    const MAX_DIST: f32 = 100.0;
    var t = 0.0;
    var position = ray.start;
    for (var i = 0u; i < MAX_ITERATIONS; i++) {
        if (t > MAX_DIST) {
            return 1.0;
        }

        let dist = scene(position);
        if (dist < MIN_DIST) {
            return 0.0;
        }

        t += dist;
        position = ray.start + t * ray.dir;
    }

    return 1.0;
}

fn scene(p: vec3f) -> f32 {
    let ground_plane = p.y + 0.5;
    //let ground_plane = sdf_plane(p, vec3f(0.0, 1.0, 0.0));
    let sphere = sdf_sphere(p - vec3f(0.0, 0.0, -0.1), 0.5);

    return sdf_union(sphere, ground_plane);
}

/**
 * Use smoothstep with a small radius from the threshold
 * to act like step, but a little softer
 */
fn softstep(threshold: f32, radius: f32, value: f32) -> f32 {
    return smoothstep(threshold - radius, threshold + radius, value);
}

/**
 * Set up something along the lines of toon shading, but based
 * on the rules of thumb in _Artists' Master Series: Color & Light_ by Charlie 
 * Pickard et al. Basically, make a 5-step color gradient based on
 * noticeably different bands of color when lighting a sphere.
 *
 * light - the light vector
 * normal - the normal vector
 * blend_radius - how much to feather the edge
 *
 * returns the quantized value
 */
fn toon_values(light: vec3f, normal: vec3f, blend_radius: f32) -> f32 {
    // 5 values
    const DARK: f32 = 0.0;

    const MID_DARK: f32 = 0.25;
    const MID: f32 = 0.5;
    const MID_LIGHT: f32 = 0.75;
    const LIGHT: f32 = 1.0;

    const COS_90: f32 = 0.0;
    const COS_80: f32 = 0.1736;
    const COS_60: f32 = 0.5;
    const COS_45: f32 = 0.7071067;

    let t = dot(light, normal);
    var result: f32 = DARK;
    result = mix(result, MID_DARK, softstep(COS_90, blend_radius, t));
    result = mix(result, MID, softstep(COS_80, blend_radius, t));
    result = mix(result, MID_LIGHT, softstep(COS_60, blend_radius, t));
    result = mix(result, LIGHT, softstep(COS_45, blend_radius, t));

    return result;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    const EYE: vec3f = vec3f(0.0, 0.0, 1.0);

    let pixel = vec3f(input.uv, 0.0);
    let dir = normalize(pixel - EYE);

    let ray = Ray(EYE, dir);
    let result = raymarch(ray);

    const LIGHT: vec3f = normalize(vec3f(-0.1, 1.0, 0.5));
    let diffuse = clamp(dot(LIGHT, result.normal), 0.0, 1.0);
    let diffuse_color = srgb_to_linear(vec3f(1.0, 0.5, 0.0));

    let shadow_ray = Ray(result.hit_position + 0.01 * result.normal, LIGHT);
    let shadow = raymarch_shadow(shadow_ray);

    let toon = toon_values(result.normal, LIGHT, 0.01);

    let t = fract(0.5 * u_frame.time);
    let comparison = mix(toon, diffuse, t);

    let diff = abs(toon - diffuse);

    let color = shadow * diffuse_color * toon;

    return vec4f(linear_to_srgb(color), 1.0);
}

fn srgb_to_linear(srgb: vec3f) -> vec3f {
    const GAMMA: vec3f = vec3f(2.2);
    return pow(srgb, GAMMA);
}

fn linear_to_srgb(linear: vec3f) -> vec3f {
    const GAMMA: vec3f = vec3f(1.0 / 2.2);
    return pow(linear, GAMMA);
}