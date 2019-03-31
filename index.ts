/* tslint:disable:file-name-casing */

import {GetTicker} from './src/GetTicker'
import {IScheduler} from './src/IScheduler'
import {Job} from './src/Job'
import {Scheduler} from './src/Scheduler'

export {Job} from './src/Job'
export {Cancel} from './src/Cancel'
export {IScheduler}

export const scheduler: IScheduler = new Scheduler(GetTicker())
