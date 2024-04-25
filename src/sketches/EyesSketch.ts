import { Vec2 } from '@/core/Vec2'
import type { InputSystem } from '@/input/InputSystem'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'
import EYES_SHADER from '@/shaders/eyes.wgsl?url'

export class EyesSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Centered
  shader_url: string = EYES_SHADER
  fragment_entry: string = 'eyes_main'

  position: Vec2
  constructor() {
    this.position = new Vec2(0, 0)
  }

  configure_input(input: InputSystem) {
    /*const x_axis = input.configure_
    //const [x_axis, y_axis] = input.configure_dpad(DEFAULT_DPAD)
    input.axis([])

    const x_axis = input.axis(GamepadAxes.LeftStickX)
    const y_axis = input.axis(GamepadAxes.LeftStickY)

    const arrows_lr = input.

    const gamepad_a = input.digital(GamepadButtons.A) // DigitalSignal
    const keyboard_z = input.digital(KeyboardKeys.Z) // DigitalSignal
    const a_down = new Cascade([gamepad_a, keyboard_z]) // Cascade<DigitalSignal>
    const a_trigger = new Trigger(a_down)
    const blink = new ADSR(a_trigger, [0.0, 0.5, 1.0, 0.5])

    input.configure_uniforms({
      digital: [blink],
      analog: [x_axis, y_axis]
    })*/
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
