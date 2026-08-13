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

// Compute vertical rectangles for the white keys. There will be a small
// gutter between each one. The result will span the entire height of the
// screen; this is further masked in the main function.
fn layer_white_keys(uv: vec2f) -> vec4f {
    // divide the width of the canvas into 7 buckets, one for each white
    // key in an octave
    let key_coords = 7.0 * uv.x;
    let u_white_key = fract(key_coords);
    let white_key_index = u32(floor(key_coords));

    // Highlight the key at this cursor if the MIDI key is currently pressed.
    let semitones = SEMITONES_WHITE_KEYS[white_key_index];
    let gate_white = get_digital(semitones);
    let color_white_keys = 
        select(COLOR_WHITE_KEYS, COLOR_WHITE_KEYS_HIGHLIGHT, gate_white);

    // Add a small gutter between columns to make them look more like piano
    // keys.
    let white_key_mask = 
        interval_mask(u_white_key, WHITE_KEY_MARGIN, WHITE_KEY_WIDTH);

    return vec4f(color_white_keys, white_key_mask);
}

// Layer for the black keys. This works in similar fashion to layer_white_keys()
// with a few differences:
// - black keys are staggered between the white keys
// - there are gaps between some keys (e.g. between E and F)
// - the keys are more narrow
// - The keys are shorter than the height of the keyboard, so an extra mask
//   is applied to restrict it to the top portion of the screen.
fn layer_black_keys(uv: vec2f) -> vec4f {
    // Divide the width of the screen into buckets, staggered halfway
    // between the white keys. This includes gaps between black keys, that
    // will be handled below.
    let key_coords = 7.0 * uv.x + 0.5;
    let u_black_key = fract(key_coords);
    let black_key_index = u32(floor(key_coords));

    // Highlight keys by MIDI note
    let semitones_black = SEMITONES_BLACK_KEYS[black_key_index];
    let gate_black = get_digital(semitones_black);
    let color_black_keys = 
        select(COLOR_BLACK_KEYS, COLOR_BLACK_KEYS_HIGHLIGHT, gate_black);

    // Only show the keys in the top portion of the screen. The bottom edge
    // is slightly lower than halfway down the screen.
    let black_key_section = rect_mask(uv, vec2f(0.0, 0.45), vec2f(1.0, 1.0));

    // The black keys are a bit 
    let narrow_key_mask = 
        interval_mask(u_black_key, BLACK_KEY_MARGIN, BLACK_KEY_WIDTH);

    // Mask that removes gaps between keys
    let is_valid = f32(semitones_black != DUMMY);

    // Intersect all 3 of the above masks to get the desired shape.
    let black_key_mask = narrow_key_mask * black_key_section * is_valid;

    return vec4f(color_black_keys, black_key_mask);
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let layer_white = layer_white_keys(input.uv);
    let layer_black = layer_black_keys(input.uv);    
    
    // clip the keyboard to the middle third of the screen
    let keyboard_mask = 
        rect_mask(input.uv, vec2f(0.0, 1.0 / 3.0), vec2f(1.0, 1.0 / 3.0));

    var color = COLOR_BG;
    color = mix(color, layer_white.rgb, layer_white.a * keyboard_mask);
    color = mix(color, layer_black.rgb, layer_black.a * keyboard_mask);
    return vec4f(color, 1.0);
}
