export interface RenderPipelineTemplate {
  render_pass(pass: GPURenderPassEncoder): void
}

export class RenderPipeline {
  private template: RenderPipelineTemplate
  render_pipeline?: GPURenderPipeline

  constructor(template: RenderPipelineTemplate) {
    this.template = template
  }

  async create(device: GPUDevice) {
    // For now this is constant, but it depends on the bind groups needed
    // for the shader
    const pipeline_layout = device.createPipelineLayout({
      bindGroupLayouts: []
    })

    const vertex_state: GPUVertexState = {}

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

  render(encoder: GPUCommandEncoder, context: GPUCanvasContext) {
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
    this.template.render_pass(render_pass)
    render_pass.end()
  }
}
