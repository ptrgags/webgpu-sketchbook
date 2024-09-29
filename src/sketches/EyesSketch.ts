import { Vec2 } from '@/core/Vec2'
import { ADSR } from '@/input/ADSR'
import { AnalogCascade, DigitalCascade } from '@/input/CascadeSignal'
import { GamepadButtons } from '@/input/GamepadInput'
import type { InputSystem } from '@/input/InputSystem'
import { ReleaseSignal } from '@/input/ReleaseSignal'
import type { AnalogSignal } from '@/input/Signal'
import { TriggerSignal } from '@/input/TriggerSignal'
import { AnalogConst } from '@/input/const_signal'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import EYES_SHADER from '@/shaders/eyes.wgsl?url'

export class EyesSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = EYES_SHADER
  fragment_entry: string = 'eyes_main'
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

    // TODO: also include keyboard arrows and WASD
    this.x_axis = new AnalogCascade([ls_x, dpad_x, arrows_x, wasd_x])
    this.y_axis = new AnalogCascade([ls_y, dpad_y, arrows_y, wasd_y])

    // TODO: also include keyboard Z using DigitalCascade
    const a_button = input.gamepad.digital_button(GamepadButtons.A)
    const z_key = input.keyboard.digital_key('KeyZ')
    const blink_button = new DigitalCascade([a_button, z_key])

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

  // Input precedence:
  //
  // Gamepad > Keyboard
  // Gamepad: JoystickDpad > DPad
  // Keyboard: Arrows > WASD
  //
  // AButton: A on Gamepad, Z on keyboard

  // Inputs used:
  // DPad
  // AButton

  // on update:
  //
  // down(DPad):
  //    position += speed * direction(DPad) * dt
  //    position = clamp(position, -1, 1)

  // on uniform update:
  // blink: f32 = LinearADSR(AButton, attack: A, decay: 0, sustain: 1, release: release_time, t) // trapezoid envelope
  // flags: u32
  //    0-3: down(DPad)

  // Shader:
  // - basic quad shader pipeline with centered UVs
  // - compute min distance to 4 neighbors and make voronoi diagram
  // - also compute distance to player
  // - if player distance is smaller, change to color based on any(flags[0:3])
}
