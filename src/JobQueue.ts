import {Job} from './Job'
import {Cancel} from './Cancel'

export interface JobQueue {
  enqueue(job: Job, priority: number): Cancel
  flush(): void
}
