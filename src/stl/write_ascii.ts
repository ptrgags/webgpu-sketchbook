/**
 * Write an ASCII string to a binary buffer
 * @param data_view Data view to populate
 * @param str the ascii string to write to the buffer
 * @param offset The offset at which to write the string at
 * @returns The offset just after the end of the written data
 */
export function write_ascii(data_view: DataView, str: string, offset: number): number {
  for (let i = 0; i < str.length; i++) {
    data_view.setUint8(offset + i, str.charCodeAt(i))
  }

  return offset + str.length
}
