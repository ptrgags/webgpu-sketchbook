fn modulo(x: i32, n: i32) -> i32 {
    return ((x % n) + n) % n;
}

struct BouncingCircle {
    start_position: vec2f,
    velocity: vec2f,
    radius: f32
}

const START_POINT = vec2f(0.0, 0.0);

const START_A = vec2f(-0.1, -2.0);
const VELOCITY_A = vec2f(1.0, 2.0);
const RADIUS_A = 0.3;

const CIRCLES_A = array(
    BouncingCircle(START_A - 1.0 * VELOCITY_A, VELOCITY_A, RADIUS_A),
    BouncingCircle(START_A - 0.5 * VELOCITY_A, VELOCITY_A, RADIUS_A),
    BouncingCircle(START_A + 0.0 * VELOCITY_A, VELOCITY_A, RADIUS_A),
    BouncingCircle(START_A + 0.5 * VELOCITY_A, VELOCITY_A, RADIUS_A),
    BouncingCircle(START_A + 1.0 * VELOCITY_A, VELOCITY_A, RADIUS_A),
);

const START_B = vec2f(0.1, -2.0);
const VELOCITY_B = vec2f(1.0, -2.0);
const RADIUS_B = 0.3;

const CIRCLES_B = array(
    BouncingCircle(START_B - 1.0 * VELOCITY_B, VELOCITY_B, RADIUS_B),
    BouncingCircle(START_B - 0.5 * VELOCITY_B, VELOCITY_B, RADIUS_B),
    BouncingCircle(START_B + 0.0 * VELOCITY_B, VELOCITY_B, RADIUS_B),
    BouncingCircle(START_B + 0.5 * VELOCITY_B, VELOCITY_B, RADIUS_B),
    BouncingCircle(START_B + 1.0 * VELOCITY_B, VELOCITY_B, RADIUS_B),
);
const CIRCLE_COUNT = 5;

struct MirrorCell {
    id: vec2i,
    folded_position: vec2f,
}

/**
 * Given a position (moving in a straight line over time), fold space
 * at the boundaries of a rectangle so the straight line gets folded into
 * a bouncing line.
 */
fn fold_space(pos: vec2f, corner: vec2f, dimensions: vec2f) -> MirrorCell {
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
    let folded_position = corner + mirrored_uv * dimensions;
    return MirrorCell(cell_id, folded_position);
}

const SCREEN_DIMS = vec2f(2.0, 2.0 * 7.0/5.0);
const SCREEN_CORNER = vec2f(-1.0, -7.0/5.0);

// 12 color "semitones" around the color wheel
// TODO: do this in Oklch space instead of sRGB
const PALETTE = array(
    vec3f(1, 0, 0),
    vec3f(1, 0.5, 0),
    vec3f(1, 1, 0),
    vec3f(0.5, 1, 0),
    vec3f(0, 1, 0),
    vec3f(0, 1, 0.5),
    vec3f(0, 1, 1),
    vec3f(0, 0.5, 1),
    vec3f(0, 0, 1),
    vec3f(0.5, 0, 1),
    vec3f(1, 0, 1),
    vec3f(1, 0, 0.5),
);

const ANIMATION_SPEED = 0.5;

fn bouncing_circle(uv: vec2f, circle: BouncingCircle) -> vec4f {
    let position = circle.start_position + ANIMATION_SPEED * u_frame.time * circle.velocity;

    let bounce_corner = SCREEN_CORNER + circle.radius;
    let bounce_dimensions = SCREEN_DIMS - 2.0 * circle.radius;
    let cell = fold_space(position, bounce_corner, bounce_dimensions);

    let dist_circle = sdf_circle(uv - cell.folded_position, circle.radius);

    // Pick a color based on which cell we're in.
    // To describe this, I'm using a musical analogy of a bass guitar
    // fretboard, 
    //
    //   +5 semitones
    //    ^
    //    |
    // G------------
    // D------------
    // A------------  --> +1 semitone
    // E------------
    const SEMITONE_OFFSET = vec2i(1, 5);
    let semitones = modulo(dot(cell.id, SEMITONE_OFFSET), 12);

    let base_color = PALETTE[semitones];

    const THICKNESS = 0.01;
    const FEATHER = 0.001;
    var circle_color = mix(
        vec3f(0), 
        base_color,
        smoothstep(
            THICKNESS + FEATHER,
            THICKNESS,
            dist_circle
        )
    );
    circle_color = mix(
        circle_color, 
        vec3f(1), 
        smoothstep(
            - THICKNESS, 
            - circle.radius, 
            dist_circle
        )
    );

    return vec4f(circle_color, dist_circle);
}


@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    var color_a = vec3f(0.0, 0.0, 0.0);
    var dist_a = 1.0e10;
    for (var i = 0; i < CIRCLE_COUNT; i++) {
        let circle = bouncing_circle(input.uv, CIRCLES_A[i]);
        dist_a = sdf_union(dist_a, circle.a);
        color_a = bitwise_color(color_a, circle.rgb, OP_OR);
    }

    var color_b = vec3f(0.0, 0.0, 0.0);
    var dist_b = 1.0e10;
    for (var i = 0; i < CIRCLE_COUNT; i++) {
        let circle = bouncing_circle(input.uv, CIRCLES_B[i]);
        dist_b = sdf_union(dist_b, circle.a);
        color_b = bitwise_color(color_b, circle.rgb, OP_OR);
    }

    let color_and = bitwise_color(color_a, color_b, OP_AND);
    let mask_and = 1.0 - step(0.0, sdf_intersect(dist_a, dist_b));

    let color_just_a = bitwise_color(color_a, color_b, OP_A_NOT_IMPLIES_B);
    let mask_just_a = 1.0 - step(0.0, sdf_subtract(dist_a, dist_b));

    let color_just_b = bitwise_color(color_a, color_b, OP_B_NOT_IMPLIES_A);
    let mask_just_b = 1.0 - step(0.0, sdf_subtract(dist_b, dist_a));

    let color_nor = bitwise_color(color_a, color_b, OP_NOR);
    let mask_nor = 1.0 - step(0.0, -sdf_union(dist_a, dist_b));

    var color = vec3f(0.0);
    color = mix(color, color_nor, mask_nor);
    color = mix(color, color_and, mask_and);
    color = mix(color, color_just_a, mask_just_a);
    color = mix(color, color_just_b, mask_just_b);

    return vec4f(color, 1.0);
}
