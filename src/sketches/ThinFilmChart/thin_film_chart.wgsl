const IOR_AIR = 1.0003;
// wavelengths in nanometers
const WAVELENGTH_RED = 650;
const WAVELENGTH_GREEN = 530;
const WAVELENGTH_BLUE = 460;

const MIN_THICKNESS = 0;
const MAX_THICKNESS = 700;
const IOR = 1.3; //1.333; //2.6;//1.3;
const ANGLE = 0;

/**
 * Compute the intensity due to thin film interference for a specific set
 * of lighting conditions
 *
 * wavelength: wavelength of the incident light in nanometers
 * ior_film: index of refraction of the thin film
 * thickness: thickness of the thin film in nanometers
 * angle1: angle of incident light with respect to the normal in radians
 */
fn thin_film_interference(wavelength: f32, ior_film: f32, thickness: f32, angle1: f32) -> f32 {
    // snell's law to get the refracted angle
    let s1 = sin(angle1);
    let n = ior_film / IOR_AIR;
    //let c2 = sqrt(1.0 - s1 / n);
    let c2 = sqrt(1.0 - pow(IOR_AIR / ior_film, 2.0) * s1 * s1);


    // See http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/interf.html#c1
    // and
    // https://physics.stackexchange.com/questions/611891/why-does-rm-tio-2-require-less-thickness-for-thin-film-interference-than-ligh
    let path_difference = 2.0 * ior_film * thickness * c2;
    //let intensity = abs(cos(path_difference/wavelength * PI));
    let intensity = 0.5 - 0.5 * cos(PI * path_difference/wavelength);
    return intensity;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let y = input.uv.y;

    let thickness = mix(MIN_THICKNESS, MAX_THICKNESS, y);
    
    // constant n, incident angle from 0 to 90 degrees
    //let angle = mix(0, PI / 2, input.uv.x);
    //let ior = 1.3;
    
    // Constant incident angle of PI/6, ior from 1.0 to 2.0
    let angle = PI/6;
    let ior = mix(1.0, 2.0, input.uv.x);

    let color = vec3f(
        thin_film_interference(WAVELENGTH_RED, ior, thickness, angle),
        thin_film_interference(WAVELENGTH_GREEN, ior, thickness, angle),
        thin_film_interference(WAVELENGTH_BLUE, ior, thickness, angle),
    );

    let wavelengths = vec3f(
        WAVELENGTH_RED,
        WAVELENGTH_GREEN,
        WAVELENGTH_BLUE
    );

    return vec4f(color, 1.0);
}
