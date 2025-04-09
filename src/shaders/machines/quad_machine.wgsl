// Digital signals are stored as chunks of u32 bit flags, packed into vec4u. 
// This is enough for 128 button states per vector. So in total we can support
// 256 signals, enough for a MIDI keyboard and 128 other signals in the worse
// case! (though in practice I'll be using far less than this)
const MAX_DIGITAL_VECTORS = 2;
// Analog signals are stored as normalized f32s (signed or unsigned depends on
// the config)
const MAX_ANALOG_VECTORS = 4;

struct VertexInput {
    @location(0) position: vec2f,
    @location(1) uv: vec2f,
}

struct Interpolated {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
}

struct FrameUniforms {
    time: f32,
}

struct InputUniforms {
    // Digital signals (like button pressed/down/released)
    //
    // Address is vccbbbbb
    // v = vector_index 0-1
    // cc = component_index 0-3
    // bbbbb = bit index 0-31
    //
    // total: 2 * 4 * 32 = 256 digital signals
    digital: array<vec4u, MAX_DIGITAL_VECTORS>,
    // Analog signals (like gamepad axes)
    //
    // Address: vvcc
    // vv = vector_index 0-4
    // cc = component index 0-4
    //
    // total: 4 * 4 = 8 analog signals
    analog: array<vec4f, MAX_ANALOG_VECTORS>,
}

@group(0) @binding(0) var<uniform> u_frame: FrameUniforms;
@group(0) @binding(1) var<uniform> u_input: InputUniforms;

// Get a digital signal. This handles the indexing and bit twiddling
fn get_digital(button_id: u32) -> bool {
    // Address is v cc bbbbb
    let bit_index = button_id & 0x1f;
    let component_index = (button_id >> 5) & 0x03;
    let vector_index = (button_id >> 7) & 0x01;
    let component = u_input.digital[vector_index][component_index];
    
    return bool((component >> bit_index) & 0x01);
}

// Get the analog signal by ID. This handles the indexing.
fn get_analog(axis_id: u32) -> f32 {
    // address is vv cc
    let component_index = axis_id & 0x03;
    let vector_index = (axis_id >> 2) & 0x03;

    return u_input.analog[vector_index][component_index];
}

@vertex
fn vertex_default(input: VertexInput) -> Interpolated {
    var output: Interpolated;
    output.position = vec4f(input.position, 0.0, 1.0);
    output.uv = input.uv;
    return output;
}

@fragment
fn fragment_default(input: Interpolated) -> @location(0) vec4f {
    return vec4f(input.uv, 0.0, 1.0);
}
