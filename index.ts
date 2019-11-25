/* tslint:disable:file-name-casing */

import {GetTicker} from './src/internals/GetTicker'
import {IScheduler} from './src/main/IScheduler'
import {ITestSchedulerOptions} from './src/main/ITestSchedulerOptions'
import {Scheduler} from './src/main/Scheduler'
import {TestScheduler} from './src/main/TestScheduler'

/**
 * E X P O R T S
 */

/**
 * Used for writing tests.
 *
 * ```ts
 * import {testScheduler} from 'ts-scheduler/test'
 *
 * const scheduler = testScheduler()
 *
 * scheduler.asap({execute: () => console.log('Hi!')})
 *
 * // Doesn't execute until run() is called
 * scheduler.run()
 * ```
 *
 */
export const testScheduler = (options: Partial<ITestSchedulerOptions> = {}) =>
  new TestScheduler(options)

export {TestScheduler} from './src/main/TestScheduler'

/**
 * Optional version of [[ITestSchedulerOptions]] which is provided as input.
 */
export type SchedulerOptions = Partial<ITestSchedulerOptions>

export {ICancellable} from './src/cancellables/ICancellable'

export {IScheduler}

export const scheduler: IScheduler = new Scheduler(GetTicker())
