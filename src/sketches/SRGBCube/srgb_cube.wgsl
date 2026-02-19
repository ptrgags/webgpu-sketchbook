
struct Interpolated {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f,
}

fn translate(offset: vec3f) -> mat4x4f {
    return mat4x4f(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        offset.x, offset.y, offset.z, 0
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

    // my world space is (x, y, z) with z up  
    // camera space is (back, right, up)
    // rotating from world -> camera would be the matrix [back, right, up]
    // but we want the inverse. For a rotation, this is [back, right, up]^T
    // but we write it column major, so we get the following:
    let orient_frame = mat4x4f(
        back.x, right.x, up.x, 0,
        back.y, right.y, up.y, 0,
        back.z, right.z, up.z, 0,
        0, 0, 0, 1,
    );

    return orient_frame * to_origin;
}

struct OrthoFrustum {
    corner1: vec3f,
    corner2: vec3f,
}

const ASPECT_RATIO = 5.0 / 7.0;
fn make_ortho_frustum(half_height: f32, near_depth: f32, far_depth: f32) -> OrthoFrustum {
    let half_width = ASPECT_RATIO * half_height;
    
    return OrthoFrustum(
        vec3f(half_width, -half_height, -near_depth),
        vec3f(half_height, half_height, -far_depth),
    );
}

fn make_ortho_matrix(frustum: OrthoFrustum) -> mat4x4f {
    //let near_to_origin = 

    let dimensions = frustum.corner2 - frustum.corner1;
    let scale_factor = vec3f(2.0 / dimensions);
    return scale(scale_factor);
}

@vertex 
fn vertex_main(input: VertexInput) -> Interpolated {
    var output: Interpolated;

    let camera = look_at(vec3f(2.0, 2.0, 2.0), vec3f(0.0));
    let frustum = make_ortho_frustum(4, 0.1, 10.0);

    let model = rotate_z(u_frame.time * PI / 2.0);
    let view = make_view(camera);
    let projection = make_ortho_matrix(frustum);

    // Fill all of clip space
    //let position = vec3f(-1, -1, 0) + input.position * vec3f(2.0, 2.0, 1.0);


    output.position = projection * view * model * vec4f(input.position, 1.0);
    output.color = input.position;
    return output;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    return vec4f(input.color, 1.0);
}
