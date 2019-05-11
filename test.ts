/* tslint:disable:file-name-casing */

import {TestScheduler, TestSchedulerOptions} from './src/TestScheduler'

export const testScheduler = (options: Partial<TestSchedulerOptions> = {}) =>
  new TestScheduler(options)
export {TestScheduler} from './src/TestScheduler'
export type SchedulerOptions = Partial<TestSchedulerOptions>
