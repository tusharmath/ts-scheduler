import {Cancel} from './Cancel'
import {Job} from './Job'

/**
 * A simple job scheduler API. You can only add/remove jobs
 */
export interface IScheduler {
  asap(job: Job): Cancel
  delay(job: Job, duration: number): Cancel
  now(): number
}
