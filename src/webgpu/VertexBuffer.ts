const SIZE_F32 = 4

/**
 * Round up a value as described in the WGSL spec, see
 * https://www.w3.org/TR/WGSL/#roundup
 *
 * @param alignment The alignment size. This is a power of two in bytes
 * @param value The value to round up
 * @returns The number rounded up to the next multiple of alignment
 */
function round_up(alignment: number, value: number): number {
  return Math.ceil(value / alignment) * alignment
}

/**
 * Vertex format. For now, it only supports float-based attributes for now.
 */
export class VertexAttribute {
  count: number
  components: number
  values: number[]
  constructor(count: number, components: number, values: number[]) {
    if (count * components !== values.length) {
      throw new Error('incorrect number of values for vertex attribute')
    }
    this.count = count
    this.components = components
    this.values = values
  }

  get element_size(): number {
    return this.components * SIZE_F32
  }

  get align(): number {
    let aligned_components = this.components
    if (this.components === 3) {
      aligned_components = 4
    }

    return aligned_components * SIZE_F32
  }

  /**
   * Get the total size of the attribute values (not accounting for padding)
   */
  get size(): number {
    return this.count * this.element_size
  }

  fill_values(data_view: DataView, offset: number, stride: number) {
    const LITTLE_ENDIAN = true
    for (let i = 0; i < this.count; i++) {
      const element_offset = i * stride + offset

      for (let j = 0; j < this.components; j++) {
        data_view.setFloat32(
          element_offset + j * SIZE_F32,
          this.values[i * this.components],
          LITTLE_ENDIAN
        )
      }
    }
  }
}

/**
 * Vertex buffer. For now, it only supports f32 and vec2f properties
 */
export class VertexBuffer {
  attributes: VertexAttribute[]

  constructor(attributes: VertexAttribute[]) {
    if (attributes.length === 0) {
      throw new Error('Trying to create vertex buffer with no attributes')
    }

    const count = attributes[0].count
    if (attributes.some((x) => x.count !== count)) {
      throw new Error('attributes in a VertexBuffer must have the same length')
    }

    this.attributes = attributes
  }

  get count(): number {
    return this.attributes[0].count
  }

  get align(): number {
    let align = 0
    for (const attribute of this.attributes) {
      align = Math.max(align, attribute.align)
    }

    return align
  }

  /**
   * Get the offsets for each member of the VertexInput struct
   */
  get member_offsets(): number[] {
    const result = []

    let offset = 0
    let prev_size = 0
    for (const attribute of this.attributes) {
      result.push(offset)

      // Pack in the element as tightly as possible while adhering
      // to the member alignment
      offset = round_up(attribute.align, offset + prev_size)
      prev_size = attribute.element_size
    }

    return result
  }

  create(device: GPUDevice): GPUBuffer {
    const offsets = this.member_offsets
    const last_index = this.attributes.length - 1

    const struct_size = round_up(
      this.align,
      offsets[last_index] + this.attributes[last_index].element_size
    )

    const vertex_buffer = device.createBuffer({
      size: this.count * struct_size,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    })

    const data_view = new DataView(vertex_buffer.getMappedRange())
    for (let i = 0; i < this.attributes.length; i++) {
      const offset = offsets[i]
      const attribute = this.attributes[i]
      attribute.fill_values(data_view, offset, struct_size)
    }

    return vertex_buffer
  }
}
