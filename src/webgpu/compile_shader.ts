export async function compile_shader(device: GPUDevice, code: string): Promise<GPUShaderModule> {
  const shader_module = device.createShaderModule({ code })
  const compilation_info = await shader_module.getCompilationInfo()
  if (compilation_info.messages.length > 0) {
    let had_error = false
    console.log('Shader compilation log:')
    for (const msg of compilation_info.messages) {
      console.log(`${msg.lineNum}:${msg.linePos} - ${msg.message}`)
      had_error ||= msg.type === 'error'

      if (had_error) {
        throw new Error('Shader failed to compile!')
      }
    }
  }

  return shader_module
}
