import { AnalogConst } from '@/input/const_signal.js'
import type { InputSystem } from '@/input/InputSystem.js'
import type { AnalogSignal } from '@/input/Signal.js'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine.js'
import DISTANCE_METRIC_SHADER from '@/shaders/distance_metrics.wgsl?url'

export class DistanceMetricSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = DISTANCE_METRIC_SHADER
  x_axis: AnalogSignal = new AnalogConst(0.0)
  y_axis: AnalogSignal = new AnalogConst(0.0)

  configure_input(input: InputSystem) {
    const [pointer_x, pointer_y] = input.pointer.screen_axes
    this.x_axis = pointer_x
    this.y_axis = pointer_y

    input.configure_uniforms({
      analog: [this.x_axis, this.y_axis]
    })
  }

  update(time: number) {
    this.x_axis.update(time)
    this.y_axis.update(time)
  }
}
