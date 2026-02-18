
struct Interpolated {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f,
}

@vertex 
fn vertex_main(input: VertexInput) -> Interpolated {
    var output: Interpolated;
    output.position = vec4f(input.position, 1.0);
    output.color = input.position;
    return output;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    return vec4f(input.position);
}
