import {Job} from './Job'
import {JobQueue} from './JobQueue'
import {Cancel} from './Cancel'

export class JobScheduler {
  constructor() {}
  enqueue(job: Job, priority: number, queue: JobQueue): Cancel {
    const cancel = queue.enqueue(job, priority)
    queue.flush()
    return cancel
  }
}
