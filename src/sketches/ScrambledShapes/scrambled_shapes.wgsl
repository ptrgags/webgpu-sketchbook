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


@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {

    let start_position = vec2f(0.1, 0.2);
    let velocity = vec2f(0.5, -1.0);
    let position = start_position + u_frame.time * velocity;

    let radius = 0.1;
    let bounce_corner = SCREEN_CORNER + radius;
    let bounce_dimensions = SCREEN_DIMS - 2.0 * radius;
    let center = bounce(position, bounce_corner, bounce_dimensions);

    let mask_bounds = rect_mask(input.uv, bounce_corner, bounce_dimensions);


    let circle = sdf_circle(input.uv - center, 0.1);
    let circle_mask = 1.0 - step(0.0, circle);
    let red_circle = vec4f(vec3f(1.0, 0.0, 0.0), circle_mask);

    var color = vec3f(0.0, 0.0, 0.0);
    color = mix(color, vec3f(1.0), mask_bounds);
    color = mix(color, red_circle.rgb, red_circle.a);
    return vec4f(color, 1.0);
}