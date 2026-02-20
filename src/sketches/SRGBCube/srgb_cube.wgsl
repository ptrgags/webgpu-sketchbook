
struct Interpolated {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f,
    @location(1) normal: vec3f,
    @location(2) uv: vec2f,
}

const IDENTITY = mat4x4f(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
);

fn translate(offset: vec3f) -> mat4x4f {
    return mat4x4f(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        offset.x, offset.y, offset.z, 1
    );
}

fn scale(factors: vec3f) -> mat4x4f {
    return mat4x4f(
        factors.x, 0, 0, 0,
        0, factors.y, 0, 0,
        0, 0, factors.z, 0,
        0, 0, 0, 1,
    );
}

fn rotate_z(angle: f32) -> mat4x4f {
    let c = cos(angle);
    let s = sin(angle);
    return mat4x4f(
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    );
}

struct Camera {
    eye: vec3f,
    // unit directions
    right: vec3f,
    up: vec3f,
    back: vec3f
}


// Compute a camera from the eye point, the target point, and the assumption
// that +Z is up
// Checked an example by hand, see https://www.desmos.com/3d/gfntcqc476
fn look_at(eye: vec3f, at: vec3f) -> Camera {
    let back = normalize(eye - at);
    const Z_UP = vec3f(0, 0, 1);
    let right = normalize(cross(Z_UP, back));
    let up = normalize(cross(back, right));
    return Camera(eye, right, up, back);
}

/**
 * Make a view matrix for a given camera
 *
 * See also https://learnwebgl.brown37.net/07_cameras/camera_math.html
 * though I'm using a z-up world space, so the components are a little different
 * 
 * camera - the camera position/orientation
 * returns a view matrix
 */
fn make_view(camera: Camera) -> mat4x4f {
    // Translate the camera to the origin
    let to_origin = translate(-camera.eye);

    let right = camera.right;
    let up = camera.up;
    let back = camera.back;

    // after we find the coordinates relative to the eye center in world space,
    // we want to measure this along the right, up, and back vectors.
    // this would be the matrix [right, up, back]^T. But since WebGPU is
    // column-major, you write it like [right, up, back]
    let orient_frame = mat4x4f(
        right.x, up.x, back.x, 0,
        right.y, up.y, back.y, 0,
        right.z, up.z, back.z, 0,
        0, 0, 0, 1,
    );

    return orient_frame * to_origin;
}

/**
 * Make the inverse view matrix diretly, no inverses are
 * needed
 *
 * (R * T)^(-1) = T^(-1) * R^(-1)
 */
fn make_inv_view(camera: Camera) -> mat4x4f {
    let right = camera.right;
    let up = camera.up;
    let back = camera.back;

    let unorient_frame = mat4x4(
        right.x, right.y, right.z, 0,
        up.x, up.y, up.z, 0,
        back.x, back.y, back.z, 0,
        0, 0, 0, 1,
    );

    let from_origin = translate(camera.eye);

    return from_origin * unorient_frame;
}

// This assumes a frustum symmetric about the camera's origin, i.e.
// left = -right
struct OrthoFrustum {
    right: f32,
    top: f32,
    // Near and far are stored as positive depth values relative to the camera's eye
    near_depth: f32,
    far_depth: f32,
}

const ASPECT_RATIO = 5.0 / 7.0;

/*
 * Make an orthographic frustum. This assumes the usual 5/7 aspect ratio of
 * of my trading card shaped canvas
 * depths are given as positive values from the camera's eye
 */
fn make_ortho_frustum(half_height: f32, near_depth: f32, far_depth: f32) -> OrthoFrustum {
    let half_width = ASPECT_RATIO * half_height;
    
    return OrthoFrustum(
        half_width,
        half_height,
        near_depth,
        far_depth,
    );
}

fn make_ortho_matrix(frustum: OrthoFrustum) -> mat4x4f {
    // Translate the frustum so the near plane is at the origin.
    // this is a translation from z = -near_depth to z =0
    let to_origin = translate(vec3f(0, 0, frustum.near_depth));

    // Squash the view frustum into the normalized range.
    // x: [-right, right] -> [-1, 1] so scale factor is 1/right
    // y: [-top, top] -> [-1, 1] so scale factor is 1/top
    // z: [0, far - near] -> [0, 1] so scale factor is 1/(far - near),
    //    however, NDC is a left-handed coordinate system so multiply by -1
    let scale_factor = vec3f(
        // since we're assuming a symmetrical frustum, we just divide by 
        // the right and top values
        1.0 / frustum.right, 
        1.0 / frustum.top,
        // the -1 is to flip to left-handed coordinates
        -1.0 / (frustum.far_depth - frustum.near_depth)
    );

    return scale(scale_factor) * to_origin;
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
