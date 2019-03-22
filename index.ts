/* tslint:disable:file-name-casing */

import {IScheduler} from './src/IScheduler'
import {Scheduler} from './src/Scheduler'

export {Job} from './src/Job'
export {Cancel} from './src/Cancel'
export {IScheduler}

const promise = Promise.resolve()
export const scheduler: IScheduler = new Scheduler(cb => promise.then(cb))
