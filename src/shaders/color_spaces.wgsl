fn oklab_to_linear_srgb(oklab: vec3f) -> vec3f {
	let l_ = oklab.x + 0.3963377774 * oklab.y + 0.2158037573 * oklab.z;    
	let m_ = oklab.x - 0.1055613458 * oklab.y - 0.0638541728 * oklab.z;    
	let s_ = oklab.x - 0.0894841775 * oklab.y - 1.2914855480 * oklab.z;    

	let l = l_ * l_ * l_;    
	let m = m_ * m_ * m_;    
	let s = s_ * s_ * s_;
	
	return vec3f(
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s  
    );
}

fn oklch_to_linear_srgb(oklch: vec3f) -> vec3f {
    let oklab = oklch_to_oklab(oklch);
    return oklab_to_linear_srgb(oklab);
}

fn oklch_to_oklab(oklch: vec3f) -> vec3f {
    let lightness = oklch.x;
    let chroma = oklch.y;
    let hue = oklch.z;
    let a = chroma * cos(hue);
    let b = chroma * sin(hue);

    return vec3f(lightness, a, b);
}

fn scene(p: vec3f) -> f32 {
    let ground = sdf_ground_plane(p, -1.0);
    const MAX_CHROMA: f32 = 0.4;
    const MAX_LIGHTNESS: f32 = 1.0;
    let cyl = sdf_cylinder(p, vec2f(MAX_CHROMA, 0.5 * MAX_LIGHTNESS));

    var dist = 1e10;
    dist = sdf_union(dist, ground);
    dist = sdf_union(dist, cyl);
    return dist;
}

fn handle_out_of_gamut(srgb: vec3f, default_color: vec3f) -> vec3f {
    let out_of_gamut = any(srgb > vec3f(1.0));
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
        let light = normalize(vec3f(-1, 1.0, 1));
        let diffuse = clamp(dot(light, result.normal), 0, 1);

        let is_cylinder = result.position.y > -0.6;
        
        let plane_color = diffuse * vec3f(0.1, 0.2, 0.4);
        let out_of_gamut_color = diffuse * vec3f(0.2);

        color = select(plane_color, oklch_color(result.position, out_of_gamut_color), result.position.y > -0.6);
        color = linear_to_srgb(color);
    }

    return vec4f(color, 1.0);
}




