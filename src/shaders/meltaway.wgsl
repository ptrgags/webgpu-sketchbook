const PI: f32 = 3.1415926;

fn sdf_union(a: f32, b: f32) -> f32 {
    return min(a, b);
}

fn sdf_subtract(a: f32, b: f32) -> f32 {
    // A - B = A intersect complement(B)
    return max(a, -b);
}

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

    // Stack a bunch of planes above each other and slide them back and forth
    // across the scene. This will peel away layers one at a time.
    let t = 0.8 * u_frame.time;
    let melt_height = 0.45 * cos(t);

    // Outermost layer: box
    var box = sdf_box(p - BOX_CENTER, BOX_DIMENSIONS);
    let box_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height, 0), DOWN);
    
    // cylinder inside box
    var cylinder = sdf_cylinder(p - BOX_CENTER, CYLINDER_DIMENSIONS);
    let cylinder_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height + 0.1, 0), DOWN);
    
    // Cone inside cylinder
    var cone = sdf_cone(p - CONE_CENTER, CONE_DIMENSIONS);
    let cone_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height + 0.2, 0), DOWN);
    
    // sphere inside cone
    let sphere = sdf_sphere(p - BOX_CENTER, SPHERE_RADIUS);
    let sphere_plane = sdf_plane(p - BOX_CENTER - vec3f(0, melt_height + 0.3, 0), DOWN);

    // Cut a tiny bit of the inner shapes from the outer
    // shapes to prevent the colors from bleeding
    const CLEARANCE: f32 = 0.01;
    box = sdf_subtract(box, cylinder - CLEARANCE);
    cylinder = sdf_subtract(cylinder, cone - CLEARANCE);
    cone = sdf_subtract(cone, sphere - CLEARANCE);


    let melted_box = sdf_subtract(box, box_plane);
    let melted_cylinder = sdf_subtract(cylinder, cylinder_plane);
    let melted_cone = sdf_subtract(cone, cone_plane);
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
    // Check from inner to outer since the shapes are nested
    if (sdf_sphere(p - BOX_CENTER, SPHERE_RADIUS) < 0.01) {
        return MATERIAL_SPHERE;
    }
    if (sdf_cone(p - CONE_CENTER, CONE_DIMENSIONS) < 0.01) {
        return MATERIAL_CONE;
    }
    if (sdf_cylinder(p - BOX_CENTER, CYLINDER_DIMENSIONS) <= 0.01) {
        return MATERIAL_CYLINDER;
    }
    if (sdf_box(p - BOX_CENTER, BOX_DIMENSIONS) <= 0.01) {
        return MATERIAL_BOX;
    }

    return MATERIAL_GROUND;
}

// returns a linear color
fn select_diffuse(material_id: u32) -> vec3f {
    switch material_id {
        case MATERIAL_BOX: {
            return vec3f(0.73459, 0.08124, 0.00322);
        }
        case MATERIAL_CYLINDER: {
            return vec3f(0.72844, 0.0607, 0.16138);
        }
        case MATERIAL_CONE: {
            return vec3f(0.47399, 0.09463, 0.58649);
        }
        case MATERIAL_SPHERE: {
            return vec3f(0.19855, 0.15859, 0.8845);
        }
        case MATERIAL_GROUND: {
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

    let s = sin(angle);
    let c = cos(angle);
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
        let t = 0.1 * 2.0 * PI * u_frame.time;
        let light = normalize(vec3f(-1, 1.0, 1));
        let diffuse = clamp(dot(light, result.normal), 0.0, 1.0);

        let material_id = get_material(result.position);
        let diffuse_color = select_diffuse(material_id); 

        let shadow_ray = Ray(result.position + 0.01 * result.normal, light);
        let shadow = 0.5 + 0.5 * raymarch_shadow(shadow_ray);

        let toon = toon_values(result.normal, light, 0.005);

        color = shadow * diffuse_color * diffuse;
        color = linear_to_srgb(color); 
    }


    return vec4f(color, 1.0);
}