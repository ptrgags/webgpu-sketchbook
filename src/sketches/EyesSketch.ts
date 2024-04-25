import { Vec2 } from '@/core/Vec2'
import { ADSR } from '@/input/ADSR'
import { AnalogCascade } from '@/input/CascadeSignal'
import { GamepadButtons } from '@/input/GamepadInput'
import type { InputSystem } from '@/input/InputSystem'
import { ReleaseSignal } from '@/input/ReleaseSignal'
import type { AnalogSignal, DigitalSignal } from '@/input/Signal'
import { TriggerSignal } from '@/input/TriggerSignal'
import { AnalogConst, DigitalConst } from '@/input/const_signal'
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

    // TODO: also include keyboard arrows and WASD
    this.x_axis = new AnalogCascade([ls_x, dpad_x])
    this.y_axis = new AnalogCascade([ls_y, dpad_y])

    // TODO: also include keyboard Z using DigitalCascade
    const a_button = input.gamepad.digital_button(GamepadButtons.A)
    const a_trigger = new TriggerSignal(a_button)
    const a_release = new ReleaseSignal(a_button)
    this.blink = new ADSR(a_trigger, a_release, {
      attack: 0.5,
      decay: 0.0,
      sustain: 1.0,
      release: 0.5
    })

    /*
    input.configure_uniforms({
      digital: [blink],
      analog: [x_axis, y_axis]
    })*/
  }

  update(time: number) {
    this.x_axis.update(time)
    this.y_axis.update(time)
    this.blink.update(time)

    const blink = this.blink.value
    if (blink > 0.0) {
      console.log('blink', blink)
    }
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
