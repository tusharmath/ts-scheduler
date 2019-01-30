import {IScheduler} from './IScheduler'
import {Job} from './Job'
import {OnError} from './OnError'

/**
 * A specialized version of the scheduler that handles job priority also with it.
 */
export interface IPriorityScheduler<ID> extends IScheduler<ID> {
  add(job: Job, onError: OnError, priority?: number): ID
}
