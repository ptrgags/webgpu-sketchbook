
fn rect_mask(position: vec2f, corner: vec2f, dimensions: vec2f) -> f32 {
    let top_left = step(corner, position);
    let bottom_right = 1.0 - step(corner + dimensions, position);
    let masks = top_left * bottom_right;
    return masks.x * masks.y;
}