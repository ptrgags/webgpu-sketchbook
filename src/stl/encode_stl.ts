import { SIZE_F32, SIZE_U16, SIZE_U32, SIZE_VEC3F } from '../core/sizes.js'
import type { Mesh } from '../meshes/Mesh.js'
import { write_ascii } from './write_ascii.js'
import { Vec3 } from '../core/Vec3.js'

export const HEADER_SIZE = 80
export const TRIANGLE_SIZE = 4 * SIZE_VEC3F + SIZE_U16

// The STL header can be _anything_... so you know what I have to do...
export const RICKROLL = 'Never gonna give you up / Never gonna let you down'

export interface STLTriangle {
  normal: Vec3
  a: Vec3
  b: Vec3
  c: Vec3
}

/**
 * Dissolve a triangle mesh into a soup of triangles for exporting as STL
 * @param geometry A mesh to turn to STL
 * @returns Triangle soup (list of individual triangles)
 */
export function mesh_to_triangle_soup(geometry: Mesh): STLTriangle[] {
  const triangle_count = geometry.indices.length / 3
  const result: STLTriangle[] = new Array(triangle_count)

  for (let i = 0; i < triangle_count; i++) {
    const ia = geometry.indices[3 * i]
    const ib = geometry.indices[3 * i + 1]
    const ic = geometry.indices[3 * i + 2]

    // I'm using face normals, so the value will be the same for all
    // 3 vertices
    const [nx, ny, nz] = geometry.normals.get_element(ia)

    const [ax, ay, az] = geometry.positions.get_element(ia)
    const [bx, by, bz] = geometry.positions.get_element(ib)
    const [cx, cy, cz] = geometry.positions.get_element(ic)

    result[i] = {
      normal: new Vec3(nx, ny, nz),
      a: new Vec3(ax, ay, az),
      b: new Vec3(bx, by, bz),
      c: new Vec3(cx, cy, cz)
    }
  }

  return result
}

/**
 * Encode a mesh as an STL file for downloading. Only the positions and normals
 * are included.
 * @param triangles The triangles to include
 * @returns An ArrayBuffer containing the binary data
 */
export function encode_stl(triangles: STLTriangle[]): ArrayBuffer {
  const data_size = SIZE_U32 + triangles.length * TRIANGLE_SIZE

  const buffer = new ArrayBuffer(HEADER_SIZE + data_size)
  const data_view = new DataView(buffer)

  write_ascii(data_view, RICKROLL, 0)

  // number of triangles
  const LITTLE_ENDIAN = true
  data_view.setUint32(HEADER_SIZE, triangles.length, LITTLE_ENDIAN)

  let offset = HEADER_SIZE + SIZE_U32
  for (const tri of triangles) {
    // normal
    const { normal, a, b, c } = tri
    data_view.setFloat32(offset, normal.x, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, normal.y, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, normal.z, LITTLE_ENDIAN)
    offset += SIZE_VEC3F

    // vertex a
    data_view.setFloat32(offset, a.x, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, a.y, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, a.z, LITTLE_ENDIAN)
    offset += SIZE_VEC3F

    // vertex b
    data_view.setFloat32(offset, b.x, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, b.y, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, b.z, LITTLE_ENDIAN)
    offset += SIZE_VEC3F

    // vertex c
    data_view.setFloat32(offset, c.x, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, c.y, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, c.z, LITTLE_ENDIAN)
    offset += SIZE_VEC3F

    // no other attributes, so leave the next two bytes at the default (0)
    offset += SIZE_U16
  }

  return buffer
}

/**
 * Encode a mesh as an STL file for downloading. Only the positions and normals
 * are included.
 * @param triangles The triangles to include
 * @param filename The filename
 * @returns A File object suitable for downloading
 */
export function encode_stl_file(triangles: STLTriangle[], filename: string) {
  if (!filename.endsWith('.stl')) {
    throw new Error('filename must end with .stl')
  }

  return new File([encode_stl(triangles)], filename, {
    type: 'model/stl'
  })
}
