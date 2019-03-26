/**
 * Created by tushar on 2019-03-26
 */

/**
 * Bails out as soon as enough time is spent in doing some computation
 * @param maxDuration
 * @constructor
 */
export const Bailout = (maxDuration: number = 10) => {
  const start = Date.now()
  return (): boolean => {
    if (Date.now() - start < maxDuration) {
      return true
    }
    throw new Error(`ts-scheduler: Bailed out after ${maxDuration} attempts`)
  }
}
