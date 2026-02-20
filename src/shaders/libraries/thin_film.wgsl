const IOR_AIR = 1.0003;
const IOR_OIL = 1.3;

// wavelengths in nanometers
const WAVELENGTH_RED = 650;
const WAVELENGTH_GREEN = 530;
const WAVELENGTH_BLUE = 460;

/**
 * Use Snell's law to compute the refracted angle
 * however, it's more useful to express this in terms of 
 * cosines of the angle so this can be used with
 * dot products
 *
 * returns cos(angle2)
 */
fn refracted_angle(
    cos_angle1: f32, 
    ior1: f32, 
    ior2: f32
) -> f32 {
    // snell's law:
    // sin(theta1)/sin(theta2) = n2/n1
    // solve for sin(theta2), and then convert to cosines
    // 
    // sin(theta2) = n1/n2 * sin(theta1)
    // sqrt(1 - cos^2(theta2)) = (n1/n2) * sin(theta1)
    // 1 - cos^2(theta2) = (n1/n2)^2 * sin^2(theta1)
    // cos^2(theta2) - 1 = -(n1/n2)^2 sin^2(theta1)
    // cos^2(theta2) = 1 - (n1/n2)^2 sin^2(theta1)
    // cos(theta2) = sqrt(1 - (n1/n2)^2 sin^2(theta1))
    // cos(theta2) = sqrt(1 - (n1/n2)^2 (1 - cos^2(theta1)))
    let n = ior1 / ior2;
    let n2 = n * n;
    let cos_factor = 1.0 - cos_angle1 * cos_angle1;
    return sqrt(1.0 - n2 * cos_factor);
}

/**
 * Compute an approximation of the banding patterns caused by thin-film interference
 *
 * See http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/interf.html#c1
 * and https://physics.stackexchange.com/questions/611891/why-does-rm-tio-2-require-less-thickness-for-thin-film-interference-than-ligh
 * and https://physics.stackexchange.com/a/391647
 *
 * wavelength_nm: wavelength of incomming light in nm. For rainbow effects, call this function for red, green and blue wavelengths
 * ior_film: index of refraction for the film
 * thickness: thickness of the film in nanometers
 * cos_refract_angle: cosine of the refracted angle.
 * use_phase_difference: If true, apply a 180 degree phase difference to one of the waves. This is needed for e.g. soap bubbles where the
 *   thin film of higher IOR is between two layers of lower IOR. For a thin film against a surface of higher IOR, set this to false.
 */
fn thin_film_interference(
    wavelength_nm: f32, 
    ior_film: f32, 
    thickness_nm: f32, 
    cos_refract_angle: f32, 
    use_phase_difference: bool
) -> f32 {
    let path_difference = 2.0 * ior_film * thickness_nm * cos_refract_angle;
    let phase_flip = select(1.0, -1.0, use_phase_difference);
    let intensity = 0.5 + phase_flip * 0.5 * cos(PI * path_difference / wavelength_nm);
    

    return intensity;
}