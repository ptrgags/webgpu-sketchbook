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

fn bitwise_color(color_a: vec3f, color_b: vec3f, op: u32) -> vec3f {
    let a_quantized = vec3u(255.0 * color_a);
    let b_quantized = vec3u(255.0 * color_b);

    let combined = bitwise_op(a_quantized, b_quantized, op) & vec3u(0xFF);
    return vec3f(combined) / 255.0;
}