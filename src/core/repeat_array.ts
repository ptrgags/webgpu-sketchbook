/**
 * Repeat an array of values over and over n times
 * @param values The values to repeat
 * @param n How many repeats
 * @returns an array with values repeated n times
 */
export function repeat_array<T>(values: T[], n: number): T[] {
  const result = []
  for (let i = 0; i < n; i++) {
    result.push(...values)
  }
  return result
}
