export type RenderCallback = (pass: GPURenderPassEncoder) => void

export class RenderPipeline {
  render_pipeline?: GPURenderPipeline

  async create(device: GPUDevice, vertex_state: GPUVertexState, fragment_state: GPUFragmentState) {
    // For now this is constant, but it depends on the bind groups needed
    // for the shader
    const pipeline_layout = device.createPipelineLayout({
      bindGroupLayouts: []
    })

    // Most of the time I render as triangles. This may change
    const primitive_triangles: GPUPrimitiveState = {
      topology: 'triangle-list',
      frontFace: 'ccw',
      cullMode: 'back'
    }

    this.render_pipeline = await device.createRenderPipelineAsync({
      layout: pipeline_layout,
      vertex: vertex_state,
      fragment: fragment_state,
      primitive: primitive_triangles,
      // I'm not currently using these, so leave them alone for now.
      multisample: {},
      depthStencil: undefined
    })
  }

  render(encoder: GPUCommandEncoder, context: GPUCanvasContext, callback: RenderCallback) {
    // Pipeline not ready yet
    if (!this.render_pipeline) {
      return
    }

    const pass_description: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: 'clear',
          storeOp: 'store',
          clearValue: [0, 0, 0, 1]
        }
      ]
    }

    const render_pass = encoder.beginRenderPass(pass_description)
    render_pass.setPipeline(this.render_pipeline)
    callback(render_pass)
    render_pass.end()
  }
}
