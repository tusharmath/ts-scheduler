import {Job} from './Job'
import {OnError} from './OnError'

/**
 * A simple job scheduler API. You can only add/remove jobs
 */
export interface IScheduler<ID> {
  add(job: Job, onError: OnError): ID
  remove(id: ID): void
}
