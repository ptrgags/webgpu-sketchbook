import { Vec2 } from '@/core/Vec2'
import { ADSR } from '@/input/ADSR'
import { AnalogCascade, DigitalCascade } from '@/input/CascadeSignal'
import { GamepadButtons } from '@/input/GamepadInput'
import type { InputSystem } from '@/input/InputSystem'
import { PitchClass } from '@/input/MidiInput'
import { ReleaseSignal } from '@/input/ReleaseSignal'
import type { AnalogSignal } from '@/input/Signal'
import { TriggerSignal } from '@/input/TriggerSignal'
import { AnalogConst } from '@/input/const_signal'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import EYES_SHADER from '@/shaders/eyes.wgsl?url'

export class EyesSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = EYES_SHADER
  position: Vec2
  x_axis: AnalogSignal = new AnalogConst(0.0)
  y_axis: AnalogSignal = new AnalogConst(0.0)
  blink: AnalogSignal = new AnalogConst(0.0)

  constructor() {
    this.position = new Vec2(0, 0)
  }

  configure_input(input: InputSystem) {
    const [dpad_x, dpad_y] = input.gamepad.dpad_axes
    const [ls_x, ls_y] = input.gamepad.left_stick

    const [arrows_x, arrows_y] = input.keyboard.arrow_axes
    const [wasd_x, wasd_y] = input.keyboard.wasd_axes

    this.x_axis = new AnalogCascade([ls_x, dpad_x, arrows_x, wasd_x])
    this.y_axis = new AnalogCascade([ls_y, dpad_y, arrows_y, wasd_y])

    // add an action button to control blinking the eye
    const a_button = input.gamepad.digital_button(GamepadButtons.A)
    const z_key = input.keyboard.digital_key('KeyZ')
    const c_pitch = input.midi.pitch_signal(PitchClass.C)
    const blink_button = new DigitalCascade([a_button, z_key, c_pitch])

    const a_trigger = new TriggerSignal(blink_button)
    const a_release = new ReleaseSignal(blink_button)
    const blink = new ADSR(a_trigger, a_release, {
      attack: 0.2,
      decay: 0.4,
      sustain: 0,
      release: 0.0
    })

    input.configure_uniforms({
      analog: [this.x_axis, this.y_axis, blink]
    })
  }

  update(time: number) {
    this.x_axis.update(time)
    this.y_axis.update(time)
  }
}
