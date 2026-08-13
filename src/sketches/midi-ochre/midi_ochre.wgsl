// 
fn midi_gate(note: u32) -> bool {
    let flags = u_input.digital[0][0];
    return bool((flags >> note) & 1);
}

const SEMITONES_WHITE_KEYS = array<u32,7>(0, 2, 4, 5, 7, 9, 11);


@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {


    let white_key_index = u32(floor(7.0 * input.uv.x));
    let semitones = SEMITONES_WHITE_KEYS[white_key_index];
    let gate = midi_gate(semitones);

    let color = select(vec3f(0.0), vec3f(1.0, 0.0, 0.0), gate);

    return vec4f(color, 1.0);
}
