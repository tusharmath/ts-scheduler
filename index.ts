/* tslint:disable:file-name-casing */

import {IScheduler} from './src/IScheduler'
import {Scheduler} from './src/Scheduler'

export {Cancel} from './src/Cancel'
export const scheduler: IScheduler = new Scheduler()
export {IScheduler}
