
struct Interpolated {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f,
}

@vertex 
fn vertex_main(input: VertexInput) -> Interpolated {
    var output: Interpolated;

    // Fill all of clip space
    let position = vec3f(-1, -1, 0) + input.position * vec3f(2.0, 2.0, 1.0);

    output.position = vec4f(position, 1.0);
    output.color = input.position;
    return output;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    return vec4f(input.color, 1.0);
}
