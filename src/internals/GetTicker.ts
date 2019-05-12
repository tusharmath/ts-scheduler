/**
 * Created by tushar on 2019-03-31
 */

import isNode = require('detect-node')
import {IJob} from './IJob'

const promise = Promise.resolve()
const promiseThen = (cb: IJob) => promise.then(cb)
const processNextTick = (cb: IJob) => process.nextTick(cb)

export const GetTicker = () => {
  return isNode ? processNextTick : promiseThen
}
