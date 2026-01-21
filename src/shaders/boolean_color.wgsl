struct OklchGradient {
    start_color: vec3f,
    end_color: vec3f,
}

const OKLCH_PALETTES = array(
    OklchGradient(vec3f(0.0, 0.0, 0.0), vec3f(1.0, 0.0, 0.0)),
    OklchGradient(vec3f(0.7, 0.1, 0), vec3f(0.7, 0.1, 3.1415)),
    OklchGradient(vec3f(0.5, 0.1, 14.0), vec3f(0.5, 0.1, 14.0))
);

const GRADIENT_STEPS: f32 = 16.0;

fn handle_out_of_gamut(srgb: vec3f, default_color: vec3f) -> vec3f {
    let out_of_gamut = any(srgb < vec3f(0.0)) || any(srgb > vec3f(1.0));
    return select(srgb, default_color, out_of_gamut);
}

fn palette_lookup(gradient: OklchGradient, step: f32) -> vec3f {
    let t = step / (GRADIENT_STEPS - 1.0);
    let clamped_t = clamp(t, 0.0, 1.0);
    let color_oklch = mix(gradient.start_color, gradient.end_color, clamped_t);
    let color_srgb = oklab_to_linear_srgb(color_oklch);
    let fixed_color = handle_out_of_gamut(color_srgb, vec3f(0.5));
    return linear_to_srgb(fixed_color);
}


fn rect_mask(position: vec2f, dimensions: vec2f, uv: vec2f) -> f32 {
    let top_left = step(position, uv);
    let bottom_right = 1.0 - step(position + dimensions, uv);
    let masks = top_left * bottom_right;
    return masks.x * masks.y;
}

const OP_FALSE: u32 = 0;
const OP_AND: u32 = 1;
const OP_A_NOT_IMPLIES_B: u32 = 2;
const OP_A: u32 = 3;
const OP_B_NOT_IMPLIES_A: u32 = 4;
const OP_B: u32 = 5;
const OP_XOR: u32 = 6;
const OP_OR: u32 = 7;
const OP_NOR: u32 = 8;
const OP_XNOR: u32 = 9;
const OP_NOT_B: u32 = 10;
const OP_B_IMPLIES_A: u32 = 11;
const OP_NOT_A: u32 = 12;
const OP_A_IMPLIES_B: u32 = 13;
const OP_NAND: u32 = 14;
const OP_TRUE: u32 = 15;


fn bitwise_op(a: vec3u, b: vec3u, op: u32) -> vec3u {
    switch(op) {
        case OP_FALSE: {
            return vec3u(0);
        } 
        case OP_AND: {
            return a & b;
        }
        case OP_A_NOT_IMPLIES_B: {
            return a & (~b);
        }
        case OP_A: {
            return a;
        }
        case OP_B_NOT_IMPLIES_A: {
            return (~a) & b;
        }
        case OP_B: {
            return b;
        }
        case OP_XOR: {
            return a ^ b;
        }
        case OP_OR: {
            return a | b;
        }
        case OP_NOR: {
            return ~(a | b);
        }
        case OP_XNOR: {
            return ~(a ^ b);
        }
        case OP_NOT_B: {
            return ~b;
        }
        case OP_B_IMPLIES_A: {
            return a | (~b);
        }
        case OP_NOT_A: {
            return ~a;
        }
        case OP_A_IMPLIES_B: {
            return (~a) | b;
        }
        case OP_NAND: {
            return ~(a & b);
        }
        case OP_TRUE: {
            return vec3u(0xFF);
        }
        default: {
            // same as OP_FALSE
            return vec3u(0);
        }
    }
}

fn bitwise_color(a: vec3f, b: vec3f, op: u32) -> vec3f {
    let a_u32 = vec3u(255 * a);
    let b_u32 = vec3u(255 * b);

    let combined_u32 = bitwise_op(a_u32, b_u32, op);
    let combined_u8 = combined_u32 & vec3u(0xFF);
    return vec3f(combined_u8) / 255;
}

fn sdf_boolean(a: f32, b: f32, op: u32) -> f32 {
    switch(op) {
        case OP_FALSE: {
            // positive infinity, i.e. we're far away from the shape
            return 1.0e10;
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
            return -1.0e10;
        }
        default: {
            // same as OP_FALSE
            return 1.0e10;
        }
    }
}

fn venn_diagram(uv: vec2f, op: u32) -> f32 {
    const RADIUS_CIRCLE = 30.0 / 250.0;
    const CIRCLE_Y: f32 = 300.0 / 250.0;
    const CENTER_A: vec2f = vec2f(-0.5 * RADIUS_CIRCLE, CIRCLE_Y);
    const CENTER_B: vec2f = vec2f(0.5 * RADIUS_CIRCLE, CIRCLE_Y);
    let circle_a = sdf_circle(uv - CENTER_A, RADIUS_CIRCLE);
    let circle_b = sdf_circle(uv - CENTER_B, RADIUS_CIRCLE);

    let combined = sdf_boolean(circle_a, circle_b, op);
    return 1.0 - step(0, combined);
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    var from_corner = (input.uv - vec2f(-1.0, 1.0)) / 2;
    from_corner.y = -from_corner.y;

    let grid_id = floor((GRADIENT_STEPS + 1) * from_corner);
    let a_step = grid_id.y - 1.0;
    let b_step = grid_id.x - 1.0;

    let palette_a_index = get_analog(0);
    let palette_b_index = get_analog(1);
    let selected_op = u32(get_analog(2));

    let a_swatches = vec3f(a_step / (GRADIENT_STEPS - 1));
    let b_swatches = vec3f(b_step / (GRADIENT_STEPS - 1));
    let mixed_color = bitwise_color(a_swatches, b_swatches, selected_op);

    let mask_a = rect_mask(vec2f(0, 1), vec2f(1, 16), grid_id);
    let mask_b = rect_mask(vec2f(1, 0), vec2f(16, 1), grid_id);
    let mask_table = rect_mask(vec2f(1, 1), vec2f(16, 16), grid_id);

    // venn  diagram
    let venn = venn_diagram(input.uv, selected_op);
    let venn_boundary = rect_mask(vec2f(-100/250.0, 250.0 / 250.0), vec2f(200.0 / 250.0, 1.0), input.uv);
    let venn_mask = venn * venn_boundary;

    // background layer
    var color = vec3f(0.0);
    color = mix(color, a_swatches, mask_a);
    color = mix(color, b_swatches, mask_b);
    color = mix(color, mixed_color, mask_table);
    
    color = mix(color, vec3f(1.0, 0.0, 0.0), venn_mask);

    return vec4f(color, 1.0);
}