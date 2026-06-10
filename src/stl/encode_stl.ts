import type { Vec3 } from '@/meshes/geometry.js'
import type { Mesh } from '@/meshes/Mesh.js'

function write_ascii(data_view: DataView, str: string, offset: number): number {
  for (let i = 0; i < str.length; i++) {
    data_view.setUint8(offset + 1, str.charCodeAt(i))
  }

  return offset + str.length
}

export interface STLTriangle {
  normal: [number, number, number]
  a: [number, number, number]
  b: [number, number, number]
  c: [number, number, number]
}

export function mesh_to_triangle_soup(geometry: Mesh): STLTriangle[] {
  const triangle_count = geometry.indices.length / 3
  const result: STLTriangle[] = new Array(triangle_count)

  for (let i = 0; i < triangle_count; i++) {
    const ia = geometry.indices[3 * i]
    const ib = geometry.indices[3 * i + 1]
    const ic = geometry.indices[3 * i + 2]

    // I'm using face normals, so the value will be the same for all
    // 3 vertices
    const normal = geometry.normals.get_element(ia)

    const a = geometry.positions.get_element(ia)
    const b = geometry.positions.get_element(ib)
    const c = geometry.positions.get_element(ic)

    result[i] = {
      normal: normal as Vec3,
      a: a as Vec3,
      b: b as Vec3,
      c: c as Vec3
    }
  }

  return result
}

const SIZE_F32 = 4
const SIZE_VEC3F = 3 * SIZE_F32
const SIZE_U16 = 2
const SIZE_U32 = 4

export function encode_stl(triangles: STLTriangle[]): ArrayBuffer {
  const HEADER_SIZE = 80
  const TRIANGLE_SIZE = 4 * SIZE_VEC3F + SIZE_U16
  const DATA_SIZE = SIZE_U32 + triangles.length * TRIANGLE_SIZE

  const buffer = new ArrayBuffer(HEADER_SIZE + DATA_SIZE)
  const data_view = new DataView(buffer)

  // The header can be _anything_... so you know what I have to do...
  const RICKROLL = 'Never gonna give you up / Never gonna let you down'
  write_ascii(data_view, RICKROLL, 0)

  // number of triangles
  const LITTLE_ENDIAN = true
  data_view.setUint32(HEADER_SIZE, triangles.length, LITTLE_ENDIAN)

  let offset = HEADER_SIZE + SIZE_U32
  for (const tri of triangles) {
    // normal
    const [nx, ny, nz] = tri.normal
    data_view.setFloat32(offset, nx, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, ny, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, nz, LITTLE_ENDIAN)
    offset += SIZE_VEC3F

    // vertex a
    const [ax, ay, az] = tri.a
    data_view.setFloat32(offset, ax, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, ay, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, az, LITTLE_ENDIAN)
    offset += SIZE_VEC3F

    // vertex b
    const [bx, by, bz] = tri.b
    data_view.setFloat32(offset, bx, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, by, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, bz, LITTLE_ENDIAN)
    offset += SIZE_VEC3F

    // vertex c
    const [cx, cy, cz] = tri.c
    data_view.setFloat32(offset, cx, LITTLE_ENDIAN)
    data_view.setFloat32(offset + SIZE_F32, cy, LITTLE_ENDIAN)
    data_view.setFloat32(offset + 2 * SIZE_F32, cz, LITTLE_ENDIAN)
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
