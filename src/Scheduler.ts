import {LinkedList} from 'dbl-linked-list-ds'
import {Cancel} from './Cancel'
import {IScheduler} from './IScheduler'
import {Job} from './Job'

const RESOLVED_PROMISE = Promise.resolve()

export class Scheduler implements IScheduler {
  private isFlushing = false
  private queue = new LinkedList<Job>()

  /**
   * Compared to Promise.resolve() asap is a little better —
   * 1. This mimics the exact same behavior of Promise.resolve()
   * 2. It enables efficient cancellation of jobs.
   */
  asap(job: Job): Cancel {
    const id = this.queue.add(job)
    this.flush()

    return () => this.queue.remove(id)
  }

  /**
   * Some sugar over the native setTimeout() functionality
   */
  delay(job: Job, duration: number): Cancel {
    const id = setTimeout(job, duration)
    return () => clearTimeout(id)
  }

  private onFlush = () => {
    this.isFlushing = false
    let elm = this.queue.shift()

    while (elm !== undefined) {
      const job = elm
      job()
      elm = this.queue.shift()
    }
  }

  private flush(): void {
    if (!this.isFlushing) {
      this.isFlushing = true
      RESOLVED_PROMISE.then(this.onFlush)
    }
  }
}
