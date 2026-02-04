@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {

    let position = vec2f(0.1, 0.2) + u_frame.time * 0.5 * vec2f(1.0, -2.0);

    let cell_id = vec2i(floor(position));
    let cell_uv = fract(position);
    let center = select(cell_uv, 1.0 - cell_uv, cell_id % 2 == vec2i(0));

    let mask_square = (1.0 - step(1.0, max(input.uv.x, input.uv.y))) * (step (0.0, min(input.uv.x, input.uv.y)));


    let circle = sdf_circle(input.uv - center, 0.1);
    let circle_mask = 1.0 - step(0.0, circle);
    let red_circle = vec4f(vec3f(1.0, 0.0, 0.0), circle_mask);

    var color = vec3f(0.0, 0.0, 0.0);
    color = mix(color, vec3f(1.0), mask_square);
    color = mix(color, red_circle.rgb, red_circle.a);
    return vec4f(color, 1.0);
}