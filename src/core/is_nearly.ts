const DEFAULT_EPSILON = 1e-8

/**
 * Float approximately equal test.
 * @param x First value
 * @param y Second value
 * @param [epsilon=DEFAULT_EPSILON] Floating point epsilon
 * @returns True if the float values are equal up to epsilon
 */
export function is_nearly(x: number, y: number, epsilon: number = DEFAULT_EPSILON): boolean {
  // TODO: If this isn't good enough, see https://github.com/ptrgags/math-notebook/blob/main/mobius/src/nearly.rs
  return Math.abs(x - y) < epsilon
}
