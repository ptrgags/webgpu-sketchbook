fn sdf_annulus(p: vec2f, outer_radius: f32, inner_radius: f32) -> f32 {
    let outer_circle = sdf_circle(p, outer_radius);
    let inner_circle = sdf_circle(p, inner_radius);
    return sdf_subtract(outer_circle, inner_circle);
}

fn modulo(x: f32, n: f32) -> f32 {
    return x - n * floor(x / n);
}

fn metaball(sdf: f32) -> f32 {
    return 1.0 / sdf;
}

fn meta_mask(uv: vec2f) -> f32 {
    let t = u_frame.time;

    var center = 0.5 * vec2f(cos(t), sin(t)) + 0.3 * vec2f(cos(1.5 * t), sin(1.5 * t));

    let point = sdf_point(uv - vec2f(0.2, 0.3));
    let ring = sdf_circle(uv - center, 0.4);

    return step(10.0, metaball(point) + metaball(ring));
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let t = u_frame.time;

    var center = vec2f(cos(t), sin(t)) + 0.5 * vec2f(cos(2.0 * t), sin(2.0 * t));
    center = 0.5 * center;

    let outer = 0.5;
    let inner = 0.3;
    let shadow_offset = vec2f(0.05, -0.05);
    let ring = sdf_annulus(input.uv - center, outer, inner);
    let drop_shadow = sdf_annulus(input.uv - center - shadow_offset, outer, inner);

    let point = sdf_circle(input.uv - vec2f(0.2, 0.3), 0.0);

    let ring2 = sdf_circle(input.uv - center, 0.4);

    //let ring_mask = step(10.0, metaball(point) + metaball(ring2));

    //let ring_mask = smoothstep(0.01, -0.01, ring);
    //let shadow_mask = smoothstep(0.01, -0.01, drop_shadow);

    let ring_mask = meta_mask(input.uv);
    let shadow_mask = meta_mask(input.uv - shadow_offset);

    let stripes = modulo(floor(10.0 * sdf_line(input.uv, vec2f(1.0, 1.0), 0.0)), 2.0);
    let stripe_color = mix(vec3f(0.5, 0.2, 0.4), vec3f(0.0, 0.2, 0.4), stripes);

    var color = vec3f(0.3);
    color = mix(color, vec3f(0.0), shadow_mask);
    color = mix(color, stripe_color, ring_mask);
    //color = mix(color, vec3f(1.0, 0.0, 0.0), ring_mask);

    

    return vec4f(color, 1.0);
}