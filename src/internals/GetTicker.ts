/**
 * Created by tushar on 2019-03-31
 */

import {inNode} from 'in-node'

/**
 * Promise based ticker
 * @ignore
 */
export const promiseThen = <A>(cb: (ctx: A) => void, ctx: A) =>
  Promise.resolve(ctx).then(cb)

/**
 * process.nextTick based ticker
 * @ignore
 */
export const processNextTick = <A>(cb: (ctx: A) => void, ctx: A) =>
  process.nextTick(cb, ctx)

/**
 * Extracts the most efficient ticker based on the env
 * @ignore
 */
export const GetTicker = () => {
  return inNode ? processNextTick : promiseThen
}
