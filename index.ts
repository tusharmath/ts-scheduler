/* tslint:disable:file-name-casing */

import {GetTicker} from './src/internals/GetTicker'
import {Job} from './src/internals/Job'
import {IScheduler} from './src/main/IScheduler'
import {Scheduler} from './src/main/Scheduler'

export {Job} from './src/internals/Job'
export {ICancellable} from './src/cancellables/ICancellable'
export {IScheduler}

export const scheduler: IScheduler = new Scheduler(GetTicker())
