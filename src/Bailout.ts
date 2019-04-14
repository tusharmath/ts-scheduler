/**
 * Created by tushar on 2019-03-26
 */

import {CreateErrorType} from './CreateErrorType'

/**
 * @type ErrorConstructor
 */
export const BailoutError = CreateErrorType(
  (maxDuration: number) => `bailed out after ${maxDuration}ms`
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
