/**
 * Created by tushar on 2019-03-31
 */

import isNode = require('detect-node')
import {Job} from './Job'

const promise = Promise.resolve()
const promiseThen = (cb: Job) => promise.then(cb)
const processNextTick = (cb: Job) => process.nextTick(cb)

export const GetTicker = () => {
  return isNode ? processNextTick : promiseThen
}
