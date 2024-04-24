export enum UniformType {
  F32 = 'f32',
  U32 = 'u32',
  VEC4F = 'vec4f',
  VEC4U = 'vec4u'
}

function component_count(type: UniformType): number {
  switch (type) {
    case UniformType.F32:
    case UniformType.U32:
      return 1
    case UniformType.VEC4F:
    case UniformType.VEC4U:
      return 4
  }
}

function element_size(type: UniformType): number {
  switch (type) {
    case UniformType.F32:
    case UniformType.U32:
      return 4
    case UniformType.VEC4F:
    case UniformType.VEC4U:
      return 16
  }
}

function is_float(type: UniformType): boolean {
  switch (type) {
    case UniformType.F32:
    case UniformType.VEC4F:
      return true
    case UniformType.U32:
    case UniformType.VEC4U:
      return false
  }
}

interface UniformMember {
  size: number
  value: number[]
  is_dirty: boolean
  fill_values(data_view: DataView, offset: number): void
}

export class Uniform implements UniformMember {
  type: UniformType
  #value: number[]
  is_dirty: boolean

  constructor(type: UniformType, value: number[]) {
    const expected_components = component_count(type)
    if (expected_components !== value.length) {
      throw new Error(`Uniform: expected ${expected_components}, got ${value.length}`)
    }

    this.type = type
    this.#value = value
    this.is_dirty = true
  }

  get size(): number {
    return element_size(this.type)
  }

  get value(): number[] {
    return this.#value
  }

  set value(val: number[]) {
    this.is_dirty = true
    this.#value = val
  }

  fill_values(data_view: DataView, offset: number): void {
    const LITTLE_ENDIAN = true
    const components = component_count(this.type)

    const setter = is_float(this.type) ? data_view.setFloat32 : data_view.setUint32
    const bound_setter = setter.bind(data_view)
    for (let i = 0; i < components; i++) {
      bound_setter(offset + 4 * i, this.value[i], LITTLE_ENDIAN)
    }
  }
}

export class UniformArray implements UniformMember {
  type: UniformType
  length: number
  #values: number[]
  is_dirty: boolean

  constructor(type: UniformType, length: number, values: number[]) {
    if (element_size(type) % 16 !== 0) {
      throw new Error('Array values must be aligned to a multiple of 16 bytes')
    }

    this.type = type
    this.length = length
    this.#values = values
    this.is_dirty = true
  }

  get value(): number[] {
    return this.#values
  }

  set value(val: number[]) {
    this.is_dirty = true
    this.#values = val
  }

  fill_values(data_view: DataView, offset: number): void {
    const LITTLE_ENDIAN = true
    const components = this.length * component_count(this.type)

    const setter = is_float(this.type) ? data_view.setFloat32 : data_view.setUint32
    const bound_setter = setter.bind(data_view)
    for (let i = 0; i < components; i++) {
      bound_setter(offset + 4 * i, this.#values[i], LITTLE_ENDIAN)
    }
  }

  get size(): number {
    return this.length * element_size(this.type)
  }
}

export interface UniformMemberDescriptor {
  name: string
  value: UniformMember
}

export class UniformStruct {
  private binding: number
  private member_names: string[]
  private member_map: { [key: string]: UniformMember }
  private buffer?: GPUBuffer
  size: number
  values: ArrayBuffer

  constructor(binding: number, members: UniformMemberDescriptor[]) {
    this.binding = binding
    this.member_names = members.map((x) => x.name)
    this.member_map = {}
    for (const member of members) {
      this.member_map[member.name] = member.value
    }

    this.size = members.map((x) => x.value.size).reduce((a, b) => a + b, 0)
    this.values = new ArrayBuffer(this.size)
  }

  create(device: GPUDevice) {
    if (this.buffer) {
      throw new Error('uniform buffer already exists!')
    }

    this.buffer = device.createBuffer({
      size: this.size,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    })

    this.update_buffer(device)
  }

  update_buffer(device: GPUDevice) {
    if (!this.buffer) {
      throw new Error("Buffer hasn't been created yet!")
    }

    let data_changed = false

    const data_view = new DataView(this.values)
    let offset = 0
    for (let i = 0; i < this.member_names.length; i++) {
      const name = this.member_names[i]
      const member = this.member_map[name]
      if (member.is_dirty) {
        member.fill_values(data_view, offset)
        data_changed = true
        member.is_dirty = false
      }
      offset += member.size
    }

    if (data_changed) {
      device.queue.writeBuffer(this.buffer, 0, this.values)
    }
  }

  get layout_entry(): GPUBindGroupLayoutEntry {
    return {
      binding: this.binding,
      visibility: GPUShaderStage.FRAGMENT,
      buffer: {
        type: 'uniform'
      }
    }
  }

  get bind_group_entry(): GPUBindGroupEntry {
    if (!this.buffer) {
      throw new Error('buffer not ready yet!')
    }

    return {
      binding: this.binding,
      resource: {
        buffer: this.buffer
      }
    }
  }

  get_uniform(name: string): UniformMember {
    return this.member_map[name]
  }

  update(device: GPUDevice) {
    this.update_buffer(device)
  }
}
