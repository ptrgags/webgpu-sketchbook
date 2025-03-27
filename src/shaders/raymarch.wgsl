const PI: f32 = 3.1415926;

fn sdf_union(a: f32, b: f32) -> f32 {
    return min(a, b);
}

fn scene(p: vec3f) -> f32 {
    let ground = sdf_ground_plane(p, -0.5);
    let sphere = sdf_sphere(p - vec3f(0.0, 0.0, -0.1), 0.5);
    let cylinder = sdf_cylinder(p - vec3f(1.0, 0.0, -0.5), vec2(0.25, 0.5));
    let box = sdf_box(p - vec3f(-0.5, 0.0, -0.2), vec3f(0.2, 0.5, 0.2));

    var result = sdf_union(sphere, ground);
    result = sdf_union(result, cylinder);
    result = sdf_union(result, box);
    return result;
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


    let t = 0.1 * 2.0 * PI * u_frame.time;
    let light = normalize(vec3f(cos(t), 1.0, sin(t)));
    let diffuse = clamp(dot(light, result.normal), 0.0, 1.0);
    let diffuse_color = srgb_to_linear(vec3f(1.0, 0.5, 0.0));

    let shadow_ray = Ray(result.hit_position + 0.01 * result.normal, light);
    let shadow = raymarch_shadow(shadow_ray);

    let toon = toon_values(result.normal, light, 0.005);

    let diff = abs(toon - diffuse);


    let color = shadow * diffuse_color * toon;

    return vec4f(linear_to_srgb(color), 1.0);
}