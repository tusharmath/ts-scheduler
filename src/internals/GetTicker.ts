/**
 * Created by tushar on 2019-03-31
 */

import {inNode} from 'in-node'
import {Ticker} from './Ticker'

/**
 * Promise based ticker
 * @ignore
 */
export const promiseThen: Ticker = <T extends unknown[]>(
  cb: (...t: T) => void,
  ...t: T
) => Promise.resolve(t).then(args => cb(...args))

/**
 * process.nextTick based ticker
 * @ignore
 */
export const processNextTick: Ticker = <T extends unknown[]>(
  cb: (...t: T) => void,
  ...t: T
) => process.nextTick(cb, ...t)

/**
 * Extracts the most efficient ticker based on the env
 * @ignore
 */
export const GetTicker = () => {
  return inNode ? processNextTick : promiseThen
}
