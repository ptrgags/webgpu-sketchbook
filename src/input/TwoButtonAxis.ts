import { ReleaseSignal } from './ReleaseSignal.js'
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

  update(time: number) {
    this.negative.update(time)
    this.positive.update(time)
  }

  /**
   * Shorthand for setting up a pair of buttons used to cycle a counter
   * @param decrement A digital button signal that will be turned into a release signal for the decrement button
   * @param increment A digital button signal that will be turned into a release signal for the increment button
   * @returns A TwoButtonAxis that returns either +1 or -1 once each time the corresponding button is released
   */
  static make_counter(decrement: DigitalSignal, increment: DigitalSignal): TwoButtonAxis {
    return new TwoButtonAxis(new ReleaseSignal(decrement), new ReleaseSignal(increment))
  }
}
