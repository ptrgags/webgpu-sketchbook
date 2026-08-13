const DUMMY = 12;
const SEMITONES_WHITE_KEYS = array<u32,7>(0, 2, 4, 5, 7, 9, 11);
const SEMITONES_BLACK_KEYS = array<u32,8>(DUMMY, 1, 3, DUMMY, 6, 8, 10, DUMMY);

const WHITE_KEY_WIDTH = 0.9;
const WHITE_KEY_MARGIN = 0.5 * (1.0 - WHITE_KEY_WIDTH);

const BLACK_KEY_WIDTH = 0.5;
const BLACK_KEY_MARGIN = 0.5 * (1.0 - BLACK_KEY_WIDTH);


// Colors converted from this ochre palette: 
// https://thumbs.dreamstime.com/z/hex-codes-names-colour-swatches-combinations-color-palettes-color-palette-shades-mustard-ochre-dark-yellow-earthy-363271928.jpg
const COLOR_BG = vec3f(77, 22, 1)/255.0; // "Ancient Spice" 
const COLOR_WHITE_KEYS = vec3f(191, 90, 5)/255.0; // "Aged Ochre"
const COLOR_BLACK_KEYS_HIGHLIGHT = vec3f(229, 142, 26)/255.0; // "Spiced Ochre"
const COLOR_BLACK_KEYS = vec3f(21, 4, 0)/255.0; // "Dark Ochrewood"
const COLOR_WHITE_KEYS_HIGHLIGHT = vec3f(116, 41, 2)/255.0; // "Bold Ochre"

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let u_white_key = fract(7.0 * input.uv.x);
    let white_key_index = u32(floor(7.0 * input.uv.x));
    let semitones = SEMITONES_WHITE_KEYS[white_key_index];
    let gate_white = get_digital(semitones);

    let u_black_key = fract(7.0 * input.uv.x + 0.5);
    let black_key_index = u32(floor(7.0 * input.uv.x + 0.5));
    let semitones_black = SEMITONES_BLACK_KEYS[black_key_index];
    
    let gate_black = get_digital(semitones_black);

    let color_white_keys = 
        select(COLOR_WHITE_KEYS, COLOR_WHITE_KEYS_HIGHLIGHT, gate_white);
    let color_black_keys = 
        select(COLOR_BLACK_KEYS, COLOR_BLACK_KEYS_HIGHLIGHT, gate_black);

    let keyboard_mask = 
        rect_mask(input.uv, vec2f(0.0, 1.0 / 3.0), vec2f(1.0, 1.0 / 3.0));

    let thick_key_mask = 
        interval_mask(u_white_key, WHITE_KEY_MARGIN, WHITE_KEY_WIDTH);
    let white_key_mask = thick_key_mask * keyboard_mask;

    let black_key_section = 
        rect_mask(input.uv, vec2f(0.0, 0.45), vec2f(1.0, 1.0));
    let narrow_key_mask = 
        interval_mask(u_black_key, BLACK_KEY_MARGIN, BLACK_KEY_WIDTH);
    let is_valid = f32(semitones_black != DUMMY);
    let black_key_mask = 
        narrow_key_mask * black_key_section * keyboard_mask * is_valid;

    var color = COLOR_BG;
    color = mix(color, color_white_keys, white_key_mask);
    color = mix(color, color_black_keys, black_key_mask);

    return vec4f(color, 1.0);
}
