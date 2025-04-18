fn scene(p: vec3f) -> f32 {
    let ground = sdf_ground_plane(p, -1.0);
    const MAX_CHROMA: f32 = 0.35;
    const MAX_LIGHTNESS: f32 = 1.0;
    let cyl = sdf_cylinder(p, vec2f(MAX_CHROMA, 0.5 * MAX_LIGHTNESS));

    let angle = get_analog(0);

    // Create a plane that always faces the camera
    let s = sin(angle);
    let c = cos(angle);
    let forward = vec3f(-s, 0, -c);
    let forward_plane = sdf_plane(p, forward);

    let height = 0.4 * cos(0.5 * u_frame.time);
    let plane = sdf_plane(p - vec3f(0, height, 0), vec3f(0, -1, 0));
    let clipped_cyl = sdf_subtract(cyl, sdf_union(plane, forward_plane));

    var dist = 1e10;
    dist = sdf_union(dist, ground);
    dist = sdf_union(dist, clipped_cyl);
    return dist;
}

fn handle_out_of_gamut(srgb: vec3f, default_color: vec3f) -> vec3f {
    let out_of_gamut = any(srgb < vec3f(0.0)) || any(srgb > vec3f(1.0));
    return select(srgb, default_color, out_of_gamut);
}

fn oklch_color(p: vec3f, default_color: vec3f) -> vec3f {
    let chroma = length(p.xz);
    let hue = atan2(p.z, p.x);
    let lightness = p.y + 0.5;
    let oklch = vec3f(lightness, chroma, hue);

    let srgb = oklch_to_linear_srgb(oklch);
    return handle_out_of_gamut(srgb, default_color);
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let angle = get_analog(0);

    let s = sin(angle);
    let c = cos(angle);
    let eye = 3.0 * vec3f(s, 0.5, c);
    let forward = vec3f(-s, 0, -c);
    let right = vec3f(c, 0, -s);
    let up = vec3f(0, 1, 0);

    let pixel = input.uv.x * right + input.uv.y * up + 0.1 * forward;
    let dir = normalize(pixel - eye);

    let ray = Ray(eye, dir);
    let result = raymarch(ray);

    // sky
    var color = vec3f(0.8, 0.8, 1.0);
    if (result.hit) {
        let light = normalize(-forward + vec3f(0, 1, 0));
        let diffuse = clamp(dot(light, result.normal), 0, 1);

        let is_cylinder = result.position.y > -0.6;
        
        let plane_color = diffuse * vec3f(0.1, 0.2, 0.4);
        let out_of_gamut_color = diffuse * vec3f(0.2);

        color = select(plane_color, oklch_color(result.position, out_of_gamut_color), result.position.y > -0.6);
        color = linear_to_srgb(color);
    }

    return vec4f(color, 1.0);
}




