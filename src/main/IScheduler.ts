import {ICancellable} from '../cancellables/ICancellable'
import {Job} from '../internals/Job'

/**
 * A simple job scheduler API. You can only add/remove jobs
 */
export interface IScheduler {
  /**
   * Schedules the job asap
   * @param job
   */
  asap(job: Job): ICancellable

  /**
   * Schedules the job to run after a certain period of time
   * @param job
   * @param duration
   */
  delay(job: Job, duration: number): ICancellable

  /**
   * Returns the current tick count
   */
  now(): number
}
