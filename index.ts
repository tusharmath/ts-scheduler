/* tslint:disable:file-name-casing */

import {IScheduler} from './src/IScheduler'
import {Scheduler} from './src/Scheduler'

const promise = Promise.resolve()

export {Cancel} from './src/Cancel'
export const scheduler: IScheduler = new Scheduler(cb => promise.then(cb))
export {IScheduler}
