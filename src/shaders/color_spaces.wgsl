const CIE_XYZ_TO_SRGB: mat3x3f = mat3x3f(
    3.2406255, -0.9689307, 0.0557101,
    -1.5372080, 1.8757561, -0.2040211,
    -0.4986286, 0.0415175, 1.0569959
);

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

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let id = floor(input.uv * 10);
    let t = id.x / 10.0;

    const MAX_CHROMA: f32 = 0.37;

    var color = vec3f(0.0);
    if (id.y == 0.0) {
        color = CIE_XYZ_TO_SRGB * vec3f(t, 0, 0);
    } else if (id.y == 1.0) {
        color = CIE_XYZ_TO_SRGB * vec3f(0, t, 0);
    } else if (id.y == 2.0) {
        color = CIE_XYZ_TO_SRGB * vec3f(0, 0, t);
    } else if (id.y == 3.0) {
        // increasing lightness
        color = linear_to_srgb(oklch_to_linear_srgb(vec3f(t, 0, 0)));
    } else if (id.y == 4.0) {
        // increasing chroma
        color = linear_to_srgb(oklch_to_linear_srgb(vec3f(0.5, MAX_CHROMA * t, 0)));
    } else if (id.y == 5.0) {
        // around the color wheel
        color = linear_to_srgb(oklch_to_linear_srgb(vec3f(0.5, 0.5 * MAX_CHROMA, t * 2.0 * 3.141592)));
    } else if (id.y == 6.0) {
        // mix some colors!
        let color_a = vec3f(0.8, 0.15, 91.0 * 3.1415 / 180.0); // yellow
        let color_b = vec3f(0.5, 0.25, 147.04 * 3.1415 / 180.0); // green
        let mixed = mix(color_a, color_b, t);
        color = linear_to_srgb(oklch_to_linear_srgb(mixed));
    } else if (id.y == 7.0) {
        // mix a color with its opponent
        let angle = 150.0;
        let color_a = oklch_to_oklab(vec3f(0.8, 0.1, angle * 3.1415 / 180.0)); // yellow
        let color_b = oklch_to_oklab(vec3f(0.8, 0.1, (angle + 180.0) * 3.1415 / 180.0)); // not yellow
        let mixed = mix(color_a, color_b, t);
        color = linear_to_srgb(oklab_to_linear_srgb(mixed));
    }

    let in_gamut = 1.0 - step(vec3f(1.0), color);
    return vec4f(in_gamut * color, 1.0);
}

fn linear_to_srgb(linear: vec3f) -> vec3f {
    return pow(linear, vec3f(1.0 / 2.2));
}


