/* tslint:disable:file-name-casing */

import {TestScheduler, TestSchedulerOptions} from './src/main/TestScheduler'

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
export const testScheduler = (options: Partial<TestSchedulerOptions> = {}) =>
  new TestScheduler(options)
export {TestScheduler} from './src/main/TestScheduler'

/**
 * Optional version of [[TestSchedulerOptions]]
 */
export type SchedulerOptions = Partial<TestSchedulerOptions>
