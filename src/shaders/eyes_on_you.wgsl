struct VertexInput {
    @location(0) position: vec2f
    @location(1) uv: vec2f
}

struct Interpolated {
    @builtin(position) position: vec4f
    @location(0) uv: vec2f
}

@vertex
fn vertex_main(input: VertexInput) -> Interpolated {
    var output: VertexOutput;
    output.position = vec4f(input.position, 0.0, 1.0);
    output.uv = input.uv;
    return output;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    return vec4f(uv, 0.0, 1.0);
}
