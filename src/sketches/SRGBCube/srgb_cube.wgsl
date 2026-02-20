
struct Interpolated {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f,
    @location(1) normal: vec3f,
    @location(2) uv: vec2f,
}


@vertex 
fn vertex_main(input: VertexInput) -> Interpolated {
    var output: Interpolated;

    let frequency = 0.2;
    let angle = u_frame.time * 2.0 * PI * frequency;
    let model = rotate_z(angle);
    let inv_model = rotate_z(-angle);

    let eye = vec3f(3.0, 3.0, 3.0);
    let camera = look_at(eye, vec3f(0.0));
    let view = make_view(camera); 
    let inv_view = make_inv_view(camera);

    let frustum = make_ortho_frustum(4, 0, 8);
    let projection = make_ortho_matrix(frustum);

    output.position = projection * view * model * vec4(input.position, 1.0);
    output.color = 0.5 + 0.5 * input.position;
    
    output.uv = input.uv;

    // inverse transpose distributes without reversing the
    // product, because you end up reversing twice!
    // (v * m)^-T = (m^-1 * v^-1)^T = v^-T * m^-T
    let mv_inv_transpose = transpose(inv_view) * transpose(inv_model);
    output.normal = (mv_inv_transpose * vec4f(input.normal, 1.0)).xyz;
    return output;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let n_view = normalize(input.normal);
    
    let light_view = normalize(vec3f(0, 0.5, 1));
    let diffuse = clamp(dot(light_view, n_view), 0, 1);

    let dist_center = abs(input.uv - vec2f(0.5));
    let max_dist = max(dist_center.x, dist_center.y);
    let thickness = 0.02;
    let feather = 0.005;
    let border = smoothstep(0.5 - thickness, 0.5 - thickness - feather, max_dist);

    return vec4f(border * diffuse * input.color, 1.0);
}
