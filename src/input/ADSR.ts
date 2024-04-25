import type { AnalogSignal, DigitalSignal } from './Signal'

export interface ADSRParams {
  attack: number
  decay: number
  sustain: number
  release: number
}

enum ADSRState {
  Idle,
  Playing,
  Releasing
}

function lerp(a: number, b: number, t: number) {
  return (1.0 - t) * a + t * b
}

export class ADSR implements AnalogSignal {
  trigger: DigitalSignal
  release: DigitalSignal
  adsr: ADSRParams

  value: number = 0.0
  state: ADSRState = ADSRState.Idle
  time_triggered: number = -1.0
  time_released: number = -1.0
  value_when_released: number = 0.0

  constructor(trigger: DigitalSignal, release: DigitalSignal, adsr: ADSRParams) {
    this.trigger = trigger
    this.release = release
    this.adsr = adsr
  }

  update_idle(time: number, triggered: boolean) {
    this.value = 0.0

    if (triggered) {
      this.state = ADSRState.Playing
      this.time_triggered = time
    }
  }

  update_playing(time: number, triggered: boolean, released: boolean) {
    const t_relative = time - this.time_triggered
    const { attack, decay, sustain } = this.adsr

    if (t_relative >= attack + decay) {
      this.value = sustain
    } else if (t_relative >= attack) {
      const t_value = decay === 0.0 ? 1.0 : (t_relative - attack) / decay
      this.value = lerp(1.0, sustain, t_value)
    } else {
      const t_value = attack === 0.0 ? 1.0 : t_relative / attack
      this.value = lerp(0.0, 1.0, t_value)
    }

    if (triggered) {
      // Keep the same state, but restart the timing
      this.time_triggered = time
    } else if (released) {
      // Start the release portion of the envelope from the
      // current value
      this.state = ADSRState.Releasing
      this.time_triggered = -1.0
      this.time_released = time
      this.value_when_released = this.value
    }
  }

  update_releasing(time: number, triggered: boolean) {
    if (this.adsr.release === 0.0) {
      this.value = 0.0
    } else {
      const t_value = (time - this.time_released) / this.adsr.release
      this.value = lerp(this.value_when_released, 0.0, t_value)
    }

    if (triggered) {
      this.state = ADSRState.Playing
      this.time_triggered = time
      this.time_released = -1
      this.value_when_released = 0.0
    }
  }

  update(time: number): void {
    this.trigger.update(time)
    this.release.update(time)
    const triggered = this.trigger.value
    const released = this.release.value

    if (this.state === ADSRState.Idle) {
      this.update_idle(time, triggered)
    } else if (this.state === ADSRState.Playing) {
      this.update_playing(time, triggered, released)
    } else {
      this.update_releasing(time, triggered)
    }
  }
}
