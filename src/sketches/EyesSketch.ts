import { Vec2 } from '@/core/Vec2'
import { QuadUVMode, type QuadMachineSketch } from '@/machines/QuadMachine'

export class EyesSketch implements QuadMachineSketch {
  uv_mode: QuadUVMode = QuadUVMode.Basic
  position: Vec2

  constructor() {
    this.position = new Vec2(0, 0)
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
