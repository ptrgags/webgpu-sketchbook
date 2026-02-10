struct Gradient {
    start_color: vec3f,
    end_color: vec3f
}

const PALETTES = array(
    // Grayscale (diagonal of sRGB cube)
    Gradient(BLACK, WHITE),
    // Edges around the color wheel
    Gradient(RED, YELLOW),
    Gradient(YELLOW, GREEN),
    Gradient(GREEN, CYAN),
    Gradient(CYAN, BLUE),
    Gradient(BLUE, MAGENTA),
    Gradient(MAGENTA, RED),
    // Edges across faces from primary -> primary
    // and secondary -> secondary
    Gradient(RED, GREEN),
    Gradient(GREEN, BLUE),
    Gradient(BLUE, RED),
    Gradient(YELLOW, CYAN),
    Gradient(CYAN, MAGENTA),
    Gradient(MAGENTA, YELLOW),
    // Colors to their inverses (through grey)
    Gradient(RED, CYAN),
    Gradient(GREEN, MAGENTA),
    Gradient(BLUE, YELLOW),
    // Monochrome palettes from black
    Gradient(BLACK, RED),
    Gradient(BLACK, YELLOW),
    Gradient(BLACK, GREEN),
    Gradient(BLACK, CYAN),
    Gradient(BLACK, BLUE),
    Gradient(BLACK, MAGENTA),
    // Monochrome palettes from white
    Gradient(WHITE, RED),
    Gradient(WHITE, YELLOW),
    Gradient(WHITE, GREEN),
    Gradient(WHITE, CYAN),
    Gradient(WHITE, BLUE),
    Gradient(WHITE, MAGENTA),
);

fn palette_lookup(gradient: Gradient, step: f32, total_steps: f32) -> vec3f {
    let t = step / (total_steps - 1.0);
    let clamped_t = clamp(t, 0.0, 1.0);
    return mix(gradient.start_color, gradient.end_color, clamped_t);
}

const SDF_INFINITY: f32 = 1.0e10;

fn sdf_boolean(a: f32, b: f32, op: u32) -> f32 {
    switch(op) {
        case OP_FALSE: {
            // positive infinity, i.e. we're far away from the shape
            return SDF_INFINITY;
        } 
        case OP_AND: {
            return max(a, b);
        }
        case OP_A_NOT_IMPLIES_B: {
            return max(a, -b);
        }
        case OP_A: {
            return a;
        }
        case OP_B_NOT_IMPLIES_A: {
            return max(-a, b);
        }
        case OP_B: {
            return b;
        }
        case OP_XOR: {
            // (a and not b) or (not a and b)
            return min(max(a, -b), max(-a, b));
        }
        case OP_OR: {
            return min(a, b);
        }
        case OP_NOR: {
            return -min(a, b);
        }
        case OP_XNOR: {
            // (a and b) or (a nor b) 
            return min(max(a, b), -min(a, b));
        }
        case OP_NOT_B: {
            return -b;
        }
        case OP_B_IMPLIES_A: {
            return min(a, -b);
        }
        case OP_NOT_A: {
            return -a;
        }
        case OP_A_IMPLIES_B: {
            return min(-a, b);
        }
        case OP_NAND: {
            return -max(a, b);
        }
        case OP_TRUE: {
            // negative infinity, i.e. we're guaranteed to be inside the shape
            return -SDF_INFINITY;
        }
        default: {
            // same as OP_FALSE
            return SDF_INFINITY;
        }
    }
}


const FEATHER: f32 = 0.005;
fn venn_diagram(uv: vec2f, op: u32) -> f32 {
    const RADIUS_CIRCLE = 30.0 / 250.0;
    const CIRCLE_Y: f32 = 300.0 / 250.0;
    const CENTER_A: vec2f = vec2f(-0.5 * RADIUS_CIRCLE, CIRCLE_Y);
    const CENTER_B: vec2f = vec2f(0.5 * RADIUS_CIRCLE, CIRCLE_Y);
    let circle_a = sdf_circle(uv - CENTER_A, RADIUS_CIRCLE);
    let circle_b = sdf_circle(uv - CENTER_B, RADIUS_CIRCLE);

    let combined = sdf_boolean(circle_a, circle_b, op);
    return smoothstep(FEATHER, -FEATHER, combined);
}


const FIRST_CIRCLE_CENTER: vec2f = vec2f(-7.0/8.0, -12.0/10);
const CIRCLE_STEP: vec2f = vec2f(0.25, 0.0);
const BIT_RADIUS: f32 = 0.1;
fn all_bits(uv: vec2f) -> f32 {
    var sdf = SDF_INFINITY;

    for (var i = 0; i < 8; i++) {
        let center = FIRST_CIRCLE_CENTER + f32(i) * CIRCLE_STEP;
        let radius = BIT_RADIUS;
        sdf = min(sdf, sdf_circle(uv - center, radius));
    }

    return smoothstep(FEATHER, -FEATHER, sdf);
}

fn some_bits(uv: vec2f, bit_depth: u32) -> f32 {
    var sdf = SDF_INFINITY;

    for (var i: u32 = 0; i < bit_depth; i++) {
        let center = FIRST_CIRCLE_CENTER + f32(7 - i) * CIRCLE_STEP;
        let radius = BIT_RADIUS;
        sdf = min(sdf, sdf_circle(uv - center, radius));
    }

    return smoothstep(FEATHER, -FEATHER, sdf);
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    var from_corner = (input.uv - vec2f(-1.0, 1.0)) / 2;
    from_corner.y = -from_corner.y;

    let palette_a_index = u32(get_analog(0));
    let palette_b_index = u32(get_analog(1));
    let selected_op = u32(get_analog(2));
    let bit_depth = u32(get_analog(3)) + 1;

    let gradient_steps = f32(1 << bit_depth);

    const SWATCH_THICKNESS: f32 = 1/17.0;
    const TABLE_WIDTH: f32 = 16.0 / 17.0;

    let table_uv = (from_corner - SWATCH_THICKNESS) / TABLE_WIDTH;
    let grid_id = floor(gradient_steps * table_uv);
    let a_step = grid_id.y;
    let b_step = grid_id.x;

    let a_color = palette_lookup(PALETTES[palette_a_index], a_step, gradient_steps);
    let b_color = palette_lookup(PALETTES[palette_b_index], b_step, gradient_steps);
    let mixed_color = bitwise_color(a_color, b_color, selected_op);

    let mask_a = rect_mask(from_corner, vec2f(0, SWATCH_THICKNESS), vec2f(SWATCH_THICKNESS, TABLE_WIDTH));
    let mask_b = rect_mask(from_corner, vec2f(SWATCH_THICKNESS, 0), vec2f(TABLE_WIDTH, SWATCH_THICKNESS));
    let mask_table = rect_mask(from_corner, vec2f(SWATCH_THICKNESS), vec2f(TABLE_WIDTH));

    // venn diagram to show the boolean operation
    let venn = venn_diagram(input.uv, selected_op);
    let venn_boundary = rect_mask(vec2f(-100/250.0, 250.0 / 250.0), vec2f(200.0 / 250.0, 1.0), input.uv);
    let venn_mask = venn * venn_boundary;

    let mask_all_bits = all_bits(input.uv);
    let mask_selected_bits = some_bits(input.uv, bit_depth);
    const GREY20: vec3f = vec3f(0.2);
    const ORANGE: vec3f = vec3f(1.0, 0.5, 0.0);

    // background layer
    var color = BLACK;
    color = mix(color, a_color, mask_a);
    color = mix(color, b_color, mask_b);
    color = mix(color, mixed_color, mask_table);
    color = mix(color, RED, venn_mask);
    color = mix(color, GREY20, mask_all_bits);
    color = mix(color, ORANGE, mask_selected_bits);

    return vec4f(color, 1.0);
}
