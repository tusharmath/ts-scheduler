/* tslint:disable:file-name-casing */

import {GetTicker} from './src/internals/GetTicker'
import {IJob} from './src/internals/IJob'
import {IScheduler} from './src/main/IScheduler'
import {Scheduler} from './src/main/Scheduler'

export {IJob} from './src/internals/IJob'
export {ICancellable} from './src/cancellables/ICancellable'
export {IScheduler}

export const scheduler: IScheduler = new Scheduler(GetTicker())
