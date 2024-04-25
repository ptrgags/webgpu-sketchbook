import type { AnalogSignal, DigitalSignal } from './Signal'

export class TwoButtonAxis implements AnalogSignal {
  negative: DigitalSignal
  positive: DigitalSignal

  constructor(negative: DigitalSignal, positive: DigitalSignal) {
    this.negative = negative
    this.positive = positive
  }

  get value(): number {
    /*
     *  pos | neg | value
     *  ----|-----|------
     *   0  |  0  |   0.0
     *   0  |  1  |  -1.0
     *   1  |  0  |   1.0
     *   1  |  1  |   0.0
     */
    return Number(this.positive.value) - Number(this.negative.value)
  }

  update() {
    this.negative.update()
    this.positive.update()
  }
}
