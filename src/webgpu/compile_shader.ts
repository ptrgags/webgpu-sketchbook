export async function compile_shader(
  device: GPUDevice,
  source_promises: Promise<String>[]
): Promise<GPUShaderModule> {
  const wgsl_text = await Promise.all(source_promises)
  const code = wgsl_text.join('\n')

  const shader_module = device.createShaderModule({ code })
  const compilation_info = await shader_module.getCompilationInfo()
  if (compilation_info.messages.length > 0) {
    let had_error = false
    console.log('Shader compilation log:')
    for (const msg of compilation_info.messages) {
      console.log(`${msg.lineNum}:${msg.linePos} - ${msg.message}`)
      had_error ||= msg.type === 'error'

      if (had_error) {
        throw new Error(`Shader failed to compile!\n${code}`)
      }
    }
  }

  return shader_module
}
