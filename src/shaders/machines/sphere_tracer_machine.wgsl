struct Ray {
    start: vec3f,
    dir: vec3f,
}

struct RaymarchResult {
    // Position on the surface (or back plane) 
    position: vec3f,
    // Distance along the ray
    dist: f32,
    // Normal. Only valid if the ray hit something
    normal: vec3f,
    // True if we hit something, false if the ray escaped
    hit: bool
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
    const MAX_ITERATIONS: u32 = 200;
    const MIN_DIST: f32 = 0.001;
    const MAX_DIST: f32 = 100.0;
    var t = 0.0;
    var position = ray.start;

    for (var i = 0u; i < MAX_ITERATIONS; i++) {
        // Looks like Team Rocket's blasting off agaaaaain! ✨
        if (t > MAX_DIST) {
            break;
        }

        let dist = scene(position);

        if (dist < MIN_DIST) {
            return RaymarchResult(position, t, compute_normal(position), true);
        }

        // We're clear to move the given distance to get closer to the surface
        t += dist;
        position = ray.start + t * ray.dir;
    }

    // We didn't hit anything
    return RaymarchResult(position, MAX_DIST, vec3f(0.0, 0.0, -1.0), false);
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