@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {


    let note_c = get_digital(0);
    let note_d = get_digital(2);
    let note_e = get_digital(4);

    let color = vec3f(f32(note_c), f32(note_d), f32(note_e));

    return vec4f(color, 1.0);
}
