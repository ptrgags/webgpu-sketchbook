const MIN_THICKNESS = 0;
const MAX_THICKNESS = 700;

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let y = input.uv.y;

    let thickness = mix(MIN_THICKNESS, MAX_THICKNESS, y);
    let ior = mix(1.0, 2.0, input.uv.x);
    
    // Constant incident angle of PI/6, ior from 1.0 to 2.0
    let cos_angle1 = cos(PI/6);
    let cos_angle2 = refracted_angle(cos_angle1, IOR_AIR, ior);

    let phase_diff = true;    

    let color = vec3f(
        thin_film_interference(WAVELENGTH_RED, ior, thickness, cos_angle2, phase_diff),
        thin_film_interference(WAVELENGTH_GREEN, ior, thickness, cos_angle2, phase_diff),
        thin_film_interference(WAVELENGTH_BLUE, ior, thickness, cos_angle2, phase_diff),
    );

    let wavelengths = vec3f(
        WAVELENGTH_RED,
        WAVELENGTH_GREEN,
        WAVELENGTH_BLUE
    );

    return vec4f(color, 1.0);
}
