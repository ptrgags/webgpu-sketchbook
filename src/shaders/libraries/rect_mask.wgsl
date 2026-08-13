fn interval_mask(position: f32, start: f32, width: f32) -> f32 {
    let left = step(start, position);
    let right = 1.0 - step(start + width, position);
    return left * right;
}

fn rect_mask(position: vec2f, corner: vec2f, dimensions: vec2f) -> f32 {
    let top_left = step(corner, position);
    let bottom_right = 1.0 - step(corner + dimensions, position);
    let masks = top_left * bottom_right;
    return masks.x * masks.y;
}
