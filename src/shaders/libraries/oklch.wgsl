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