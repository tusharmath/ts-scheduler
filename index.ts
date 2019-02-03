/* tslint:disable:file-name-casing */

import {IScheduler} from './src/IScheduler'
import {Scheduler} from './src/Scheduler'
import {TestScheduler} from './src/TestScheduler'

export const scheduler: IScheduler = new Scheduler()
export const testScheduler: IScheduler = new TestScheduler()
