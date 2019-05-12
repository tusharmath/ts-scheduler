import {ICancellable} from '../cancellables/ICancellable'
import {IJob} from '../internals/IJob'

/**
 * A simple job scheduler API. You can only add/remove jobs
 */
export interface IScheduler {
  /**
   * Schedules the job asap
   * @param job
   */
  asap(job: IJob): ICancellable

  /**
   * Schedules the job to run after a certain period of time
   * @param job
   * @param duration
   */
  delay(job: IJob, duration: number): ICancellable

  /**
   * Returns the current tick count
   */
  now(): number
}
