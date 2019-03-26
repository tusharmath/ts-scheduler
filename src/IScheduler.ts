import {Cancel} from './Cancel'
import {Job} from './Job'

/**
 * A simple job scheduler API. You can only add/remove jobs
 */
export interface IScheduler {
  /**
   * Schedules the job asap
   * @param job
   */
  asap(job: Job): Cancel

  /**
   * Schedules the job to run after a certain period of time
   * @param job
   * @param duration
   */
  delay(job: Job, duration: number): Cancel

  /**
   * Returns the current tick count
   */
  now(): number
}
