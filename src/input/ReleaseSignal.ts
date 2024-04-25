import type { DigitalSignal } from './Signal'

export class ReleaseSignal implements DigitalSignal {
  raw_signal: DigitalSignal
  prev: boolean
  value: boolean

  constructor(raw_signal: DigitalSignal) {
    this.raw_signal = raw_signal
    this.prev = raw_signal.value
    this.value = false
  }

  update() {
    const current = this.raw_signal.value
    this.value = this.prev && !current
    this.prev = current
  }
}
