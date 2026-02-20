
struct Interpolated {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f,
    @location(1) normal_view: vec3f,
    @location(2) uv: vec2f,
    @location(3) light_view: vec3f,
    @location(4) position_view: vec3f
}

const LIGHT_WORLD = normalize(vec3f(1.0, 1.0, 1.0));

@vertex 
fn vertex_main(input: VertexInput) -> Interpolated {
    var output: Interpolated;

    let frequency = 0.2;
    let angle = u_frame.time * 2.0 * PI * frequency;

    let eye_elevation = PI / 6 * sin(0.5 * angle);
    let eye_azimuth = angle;
    let eye_distance = 3.0;

    let cos_elevation = cos(eye_elevation);
    var eye = eye_distance * vec3f(
        cos_elevation * cos(eye_azimuth),
        cos_elevation * sin(eye_azimuth),
        sin(eye_elevation)
    );
    
    //eye = 3 * vec3f(-1, -1, 1);

    let camera = look_at(eye, vec3f(0.0));
    let view = make_view(camera); 
    let inv_view = make_inv_view(camera);

    let frustum = make_ortho_frustum(4, 0, 8);
    let projection = make_ortho_matrix(frustum);

    output.position = projection * view * vec4(input.position, 1.0);
    output.color = 0.5 + 0.5 * input.position;
    
    output.uv = input.uv;

    // model matrix is identity, so this is just view^(-T)
    let mv_inv_transpose = transpose(inv_view);
    output.normal_view = (mv_inv_transpose * vec4f(input.normal, 1.0)).xyz;

    output.light_view = (view * vec4f(LIGHT_WORLD, 1.0)).xyz;

    output.position_view = (view * vec4f(input.position, 1.0)).xyz;
    return output;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let n_view = normalize(input.normal_view);
    let light_view = normalize(input.light_view);

    // Blinn-Phong shading
    // https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_reflection_model
    let view_dir = normalize(-input.position_view);
    let half = normalize(light_view + view_dir);
    let h_dot_n = clamp(dot(half, n_view), 0, 1);
    let specular = pow(h_dot_n, 10.0);

    let l_dot_n = clamp(dot(light_view, n_view), 0, 1);
    let diffuse = l_dot_n;

    let ambient = vec3f(0.1);

    let t = 0.5 + 0.5 * sin(2.0 * PI * input.uv.x);
    let thickness = mix(100, 700, t);
    let ior = 1.5;
    let cos_angle2 = refracted_angle(l_dot_n, IOR_AIR, ior);
    let iridescent_color = thin_film_rainbow(ior, thickness, cos_angle2, true);
    
    var color = ambient + diffuse + iridescent_color * specular;

    //color = vec3(specular);
    return vec4f(color, 1.0);
}
