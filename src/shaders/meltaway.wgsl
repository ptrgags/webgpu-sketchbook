const BOX_CENTER: vec3f = vec3f(0, -0.8, 0);
const BOX_DIMENSIONS: vec3f = vec3f(0.5);
const CYLINDER_DIMENSIONS: vec2f = vec2(0.4);
const CONE_DIMENSIONS: vec2f = vec2f(0.3, 0.6);
const CONE_CENTER: vec3f = BOX_CENTER + vec3f(0, 0.3, 0);
const SPHERE_RADIUS: f32 = 0.1;

// Nest several shapes inside each other.
// See cross section graph: https://www.desmos.com/calculator/lxwswkpqdt
fn scene(p: vec3f) -> f32 {

    // ground plane at -1
    let ground = sdf_ground_plane(p, BOX_CENTER.y - BOX_DIMENSIONS.y - 0.1);

    const DOWN: vec3f = vec3f(0.0, -1, 0);

    // Stack a bunch of clipping planes above each other and slide them back and
    // forth across the scene. This will peel away layers one at a time.
    let t = 0.8 * u_frame.time;
    let melt_height = 0.45 * cos(t);

    // Outermost layer: box
    let box = sdf_box(p - BOX_CENTER, BOX_DIMENSIONS);
    let box_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height, 0), DOWN);
    
    // cylinder inside box
    let cylinder = sdf_cylinder(p - BOX_CENTER, CYLINDER_DIMENSIONS);
    let cylinder_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height + 0.1, 0), DOWN);
    
    // Cone inside cylinder
    let cone = sdf_cone(p - CONE_CENTER, CONE_DIMENSIONS);
    let cone_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height + 0.2, 0), DOWN);
    
    // sphere inside cone
    let sphere = sdf_sphere(p - BOX_CENTER, SPHERE_RADIUS);
    let sphere_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height + 0.3, 0), DOWN);

    // Cut a tiny bit of the inner shapes from the outer
    // shapes to prevent the colors from bleeding
    const CLEARANCE: f32 = 0.01;
    let fixed_box = sdf_subtract(box, cylinder - CLEARANCE);
    let fixed_cylinder = sdf_subtract(cylinder, cone - CLEARANCE);
    let fixed_cone = sdf_subtract(cone, sphere - CLEARANCE);

    // Apply the clipping planes
    let melted_box = sdf_subtract(fixed_box, box_plane);
    let melted_cylinder = sdf_subtract(fixed_cylinder, cylinder_plane);
    let melted_cone = sdf_subtract(fixed_cone, cone_plane);
    let melted_sphere = sdf_subtract(sphere, sphere_plane);

    // combine the layers into a scene
    var result = sdf_union(ground, melted_cylinder);
    result = sdf_union(result, melted_box);
    result = sdf_union(result, melted_cone);
    result = sdf_union(result, melted_sphere);

    //result = cone;
    return result;
}

const MATERIAL_GROUND: u32 = 0;
const MATERIAL_CYLINDER: u32 = 1;
const MATERIAL_BOX: u32 = 2;
const MATERIAL_CONE: u32 = 3;
const MATERIAL_SPHERE: u32 = 4;

// Get material id from hit position
fn get_material(p: vec3f) -> u32 {
    const EPSILON: f32 = 0.01;

    // Check from inner to outer since the shapes are nested
    if (sdf_sphere(p - BOX_CENTER, SPHERE_RADIUS) < EPSILON) {
        return MATERIAL_SPHERE;
    }
    if (sdf_cone(p - CONE_CENTER, CONE_DIMENSIONS) < EPSILON) {
        return MATERIAL_CONE;
    }
    if (sdf_cylinder(p - BOX_CENTER, CYLINDER_DIMENSIONS) < EPSILON) {
        return MATERIAL_CYLINDER;
    }
    if (sdf_box(p - BOX_CENTER, BOX_DIMENSIONS) < EPSILON) {
        return MATERIAL_BOX;
    }

    return MATERIAL_GROUND;
}

// returns a linear color
fn select_diffuse(material_id: u32) -> vec3f {
    switch material_id {
        case MATERIAL_BOX: {
            // orange
            return vec3f(0.73459, 0.08124, 0.00322);
        }
        case MATERIAL_CYLINDER: {
            // pink
            return vec3f(0.72844, 0.0607, 0.16138);
        }
        case MATERIAL_CONE: {
            // purple
            return vec3f(0.47399, 0.09463, 0.58649);
        }
        case MATERIAL_SPHERE: {
            // blue
            return vec3f(0.19855, 0.15859, 0.8845);
        }
        case MATERIAL_GROUND: {
            // dark tan
            return vec3f(0.2375, 0.15836, 0.06289);
        }
        default: {
            return vec3f(1, 0, 1);
        }
    }
}

/**
 * Use smoothstep with a small radius from the threshold
 * to act like step, but a little softer
 */
fn softstep(threshold: f32, radius: f32, value: f32) -> f32 {
    return smoothstep(threshold - radius, threshold + radius, value);
}

/**
 * Set up something along the lines of toon shading, but based
 * on the rules of thumb in _Artists' Master Series: Color & Light_ by Charlie 
 * Pickard et al. Basically, make a 5-step color gradient based on
 * noticeably different bands of color when lighting a sphere.
 *
 * light - the light vector
 * normal - the normal vector
 * blend_radius - how much to feather the edge
 *
 * returns the quantized value
 */
fn toon_values(light: vec3f, normal: vec3f, blend_radius: f32) -> f32 {
    // 5 values
    const DARK: f32 = 0.0;

    const MID_DARK: f32 = 0.25;
    const MID: f32 = 0.5;
    const MID_LIGHT: f32 = 0.75;
    const LIGHT: f32 = 1.0;

    const COS_90: f32 = 0.0;
    const COS_80: f32 = 0.1736;
    const COS_60: f32 = 0.5;
    const COS_45: f32 = 0.7071067;

    let t = dot(light, normal);
    var result: f32 = DARK;
    result = mix(result, MID_DARK, softstep(COS_90, blend_radius, t));
    result = mix(result, MID, softstep(COS_80, blend_radius, t));
    result = mix(result, MID_LIGHT, softstep(COS_60, blend_radius, t));
    result = mix(result, LIGHT, softstep(COS_45, blend_radius, t));

    return result;
}

@fragment
fn fragment_main(input: Interpolated) -> @location(0) vec4f {
    let angle = get_analog(0);

    // Add a slight offset to the angle so we're looking
    // at the cube at a slight angle by default
    const OFFSET = PI / 8;
    let s = sin(angle - OFFSET);
    let c = cos(angle - OFFSET);
    let eye = 3.0 * vec3f(s, 0.0, c);

    let forward = vec3f(-s, 0, -c);
    let right = vec3f(c, 0, -s);
    let up = vec3f(0, 1, 0);

    let pixel = input.uv.x * right + input.uv.y * up + 0.1 * forward;
    let dir = normalize(pixel - eye);

    let ray = Ray(eye, dir);
    let result = raymarch(ray);

    // Sky
    var color = vec3f(157, 205, 224) / 255.0;
    if (result.hit) {
        let light = normalize(vec3f(-1, 1.0, 1));
        let material_id = get_material(result.position);
        let diffuse_color = select_diffuse(material_id); 

        let shadow_ray = Ray(result.position + 0.01 * result.normal, light);
        // For shadows, just darken things a bit
        let shadow = 0.5 + 0.5 * raymarch_shadow(shadow_ray);

        let toon = toon_values(result.normal, light, 0.001);

        color = shadow * diffuse_color * toon;
        color = linear_to_srgb(color); 
    }


    return vec4f(color, 1.0);
}