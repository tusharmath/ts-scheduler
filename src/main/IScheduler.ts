import {ICancellable} from '../cancellables/ICancellable'
import {IExecutable} from '../internals/IExecutable'

/**
 * A simple job scheduler API. You can only add/remove jobs
 */
export interface IScheduler {
  /**
   * Schedules job
   * @param job
   */
  asap(job: IExecutable): ICancellable

  /**
   * Schedules the job to run after a certain period of time
   * @param job
   * @param duration
   */
  delay(job: IExecutable, duration: number): ICancellable

  /**
   * Returns the current tick count
   */
  now(): number
}
