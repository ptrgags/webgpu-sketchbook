const DUMMY = 12;
const SEMITONES_WHITE_KEYS = array<u32,7>(0, 2, 4, 5, 7, 9, 11);
const SEMITONES_BLACK_KEYS = array<u32,8>(DUMMY, 1, 3, DUMMY, 6, 8, 10, DUMMY);

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let white_key_index = u32(floor(7.0 * input.uv.x));
    let semitones = SEMITONES_WHITE_KEYS[white_key_index];
    let gate_white = get_digital(semitones);

    let black_key_index = u32(floor(7.0 * (input.uv.x + 1.0 / 14.0)));
    let semitones_black = SEMITONES_BLACK_KEYS[black_key_index];
    let gate_black = get_digital(semitones_black);

    

    let color_white_keys = select(vec3f(1.0), vec3f(0.0, 1.0, 1.0), gate_white);
    let color_black_keys = select(vec3f(0.0), vec3f(1.0, 0.0, 0.0), gate_black);

    let half = floor(2.0 * input.uv.y);
    let color = mix(color_white_keys, color_black_keys, half);

    return vec4f(color, 1.0);
}
