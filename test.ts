/* tslint:disable:file-name-casing */

import {TestScheduler, TestSchedulerOptions} from './src/main/TestScheduler'

export const testScheduler = (options: Partial<TestSchedulerOptions> = {}) =>
  new TestScheduler(options)
export {TestScheduler} from './src/main/TestScheduler'
export type SchedulerOptions = Partial<TestSchedulerOptions>
