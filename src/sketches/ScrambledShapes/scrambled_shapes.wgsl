struct BouncingCircle {
    start_position: vec2f,
    velocity: vec2f,
    radius: f32
}

const START_POINT = vec2f(0.0, 0.0);

const CIRCLES = array(
    BouncingCircle(START_POINT, vec2f(1.0, 0.5), 0.1),
    BouncingCircle(START_POINT, vec2f(-1.5, 1.0), 0.2),
    BouncingCircle(START_POINT, vec2f(-0.25, 1.5), 0.3)
);
const CIRCLE_COUNT = 3;

/**
 * Given a position (moving in a straight line over time), fold space
 * at the boundaries of a rectangle so the straight line gets folded into
 * a bouncing line.
 */
fn bounce(pos: vec2f, corner: vec2f, dimensions: vec2f) -> vec2f {
    // Switch to a coordinate system that starts at 0 at the rectangle
    // corner and is (1, 1) at corner + dimensions.
    let pos_rect = (pos - corner)/dimensions;

    // Compute the UV within the rectangle, and how many signed
    // cell repeats from the origin.
    let cell_id = vec2i(floor(pos_rect));
    let cell_uv = fract(pos_rect);

    // Since all the rectangle walls are mirrors, every time we cross
    // one we reverse the corresponding coordinate. This means that
    // the parity of the cell ID determines which UV coordinate to use. This
    // works component-wise.
    let mirrored_uv = select(cell_uv, 1.0 - cell_uv, cell_id % 2 == vec2i(0));

    // Convert back to the original coordinate space
    return corner + mirrored_uv * dimensions;
}

const SCREEN_DIMS = vec2f(2.0, 2.0 * 7.0/5.0);
const SCREEN_CORNER = vec2f(-1.0, -7.0/5.0);

fn bouncing_circle(uv: vec2f, circle: BouncingCircle) -> vec4f {
    let position = circle.start_position + u_frame.time * circle.velocity;

    let bounce_corner = SCREEN_CORNER + circle.radius;
    let bounce_dimensions = SCREEN_DIMS - 2.0 * circle.radius;
    let center = bounce(position, bounce_corner, bounce_dimensions);

    let dist_circle = sdf_circle(uv - center, circle.radius);
    let circle_mask = 1.0 - step(0.0, dist_circle);

    const CIRCLE_COLOR = vec3f(1.0, 0.0, 0.0);
    return vec4f(CIRCLE_COLOR, circle_mask);

}


@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    var color = vec3f(0.0, 0.0, 0.0);

    for (var i = 0; i < CIRCLE_COUNT; i++) {
        let circle = bouncing_circle(input.uv, CIRCLES[i]);
        color = mix(color, circle.rgb, circle.a);
    }

    return vec4f(color, 1.0);
}