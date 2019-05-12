/* tslint:disable:file-name-casing */

import {GetTicker} from './src/internals/GetTicker'
import {IExecutable} from './src/internals/IExecutable'
import {IScheduler} from './src/main/IScheduler'
import {Scheduler} from './src/main/Scheduler'

export {IExecutable} from './src/internals/IExecutable'
export {Executable} from './src/internals/Executable'
export {ICancellable} from './src/cancellables/ICancellable'
export {IScheduler}

export const scheduler: IScheduler = new Scheduler(GetTicker())
