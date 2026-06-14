import { describe, it, expect } from 'vitest'
import { write_ascii } from './write_ascii.js'
describe('write-ascii', () => {
  it('with string writes to buffer', () => {
    const buffer = new Uint8Array(5)
    const data_view = new DataView(buffer.buffer)

    const offset_after = write_ascii(data_view, 'hello', 0)

    // numbers are "hello" in ascii
    const expected = new Uint8Array([104, 101, 108, 108, 111])
    expect(buffer).toEqual(expected)
    expect(offset_after).toEqual(5)
  })

  it('with string and offset writes to buffer at correct position', () => {
    const buffer = new Uint8Array(10)
    const data_view = new DataView(buffer.buffer)

    const offset_after = write_ascii(data_view, 'hello', 5)

    const expected = new Uint8Array([0, 0, 0, 0, 0, 104, 101, 108, 108, 111])
    expect(buffer).toEqual(expected)
    expect(offset_after).toEqual(10)
  })
})
