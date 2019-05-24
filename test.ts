/* tslint:disable:file-name-casing */

import {ITestSchedulerOptions} from './src/main/ITestSchedulerOptions'
import {TestScheduler} from './src/main/TestScheduler'

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
