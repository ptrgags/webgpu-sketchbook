export async function get_device(): Promise<GPUDevice> {
  const adapter = await navigator.gpu?.requestAdapter()

  // Could not get adapter.
  if (!adapter) {
    throw new Error(`WebGPU not supported 😢`)
  }

  return await adapter.requestDevice()
}

export function get_canvas(id: string): HTMLCanvasElement {
  const element = document.getElementById(id)

  if (!element) {
    throw new Error(`could not find canvas #${id}`)
  }

  return element as HTMLCanvasElement
}

export function get_context(canvas: HTMLCanvasElement): GPUCanvasContext {
  const context = canvas.getContext('webgpu')
  if (!context) {
    throw new Error(`Could not get WebGPU context 😢`)
  }

  return context
}
