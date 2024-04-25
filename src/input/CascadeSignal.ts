import type { AnalogSignal, DigitalSignal } from './Signal'

export class DigitalCascade implements DigitalSignal {
  signals: DigitalSignal[]

  constructor(signals: DigitalSignal[]) {
    this.signals = signals
  }

  get value(): boolean {
    // If any of the buttons in the cascade are pressed, return true
    return this.signals.some((x) => x.value)
  }

  update(time: number) {
    for (const signal of this.signals) {
      signal.update(time)
    }
  }
}

export class AnalogCascade implements AnalogSignal {
  signals: AnalogSignal[]

  constructor(signals: AnalogSignal[]) {
    this.signals = signals
  }

  update(time: number): void {
    for (const signal of this.signals) {
      signal.update(time)
    }
  }

  get value(): number {
    // Get the most extreme value
    let max_abs = 0.0
    let arg_max = 0.0
    for (const signal of this.signals) {
      const val = signal.value
      const abs_val = Math.abs(val)
      if (abs_val > max_abs) {
        max_abs = abs_val
        arg_max = val
      }
    }

    return arg_max
  }
}
