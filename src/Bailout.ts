/**
 * Created by tushar on 2019-03-26
 */

import {check} from 'checked-exceptions'

/**
 * @type ErrorConstructor
 */

export const BailoutError = check(
  'BailoutError',
  (duration: number) => `bailed out after ${duration}ms`
)

/**
 * Bails out as soon as enough time is spent in doing some computation
 * @param maxDuration
 * @constructor
 */
export const Bailout = (maxDuration: number = 100) => {
  const start = Date.now()
  return (): boolean => {
    if (Date.now() - start < maxDuration) {
      return true
    }
    throw new BailoutError(maxDuration)
  }
}
