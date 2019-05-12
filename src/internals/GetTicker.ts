/**
 * Created by tushar on 2019-03-31
 */

import isNode = require('detect-node')

const promise = Promise.resolve()
const promiseThen = (cb: () => void) => promise.then(cb)
const processNextTick = (cb: () => void) => process.nextTick(cb)

export const GetTicker = () => {
  return isNode ? processNextTick : promiseThen
}
