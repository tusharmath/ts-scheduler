import {LinkedList} from 'dbl-linked-list-ds'
import {ICancellable} from '../cancellables/ICancellable'
import {NodeCancellable} from '../cancellables/NodeCancellable'
import {TimerCancellable} from '../cancellables/TimerCancellable'
import {IJob} from '../internals/IJob'
import {Job} from '../internals/Job'
import {IScheduler} from './IScheduler'

export class Scheduler implements IScheduler {
  private isFlushing = false
  private queue = new LinkedList<IJob>()
  private currentTime = Date.now()
  constructor(private cb: (cb: () => void) => void) {}

  /**
   * Compared to Promise.resolve() asap is a little better —
   * 1. This mimics the exact same behavior of Promise.resolve()
   * 2. It enables efficient cancellation of jobs.
   */
  asap(job: IJob): ICancellable {
    const id = this.queue.add(job)
    this.flush()

    return new NodeCancellable(this.queue, id)
  }

  /**
   * Some sugar over the native setTimeout() functionality
   */
  delay(job: IJob, duration: number): ICancellable {
    const id = setTimeout(() => job.execute(), duration)
    return new TimerCancellable(id)
  }

  now(): number {
    return Date.now() - this.currentTime
  }

  private onFlush = () => {
    this.isFlushing = false
    while (this.queue.length > 0) {
      const job = this.queue.shift()
      if (job !== undefined) {
        job.execute()
      }
    }
  }

  private flush(): void {
    if (!this.isFlushing) {
      this.isFlushing = true
      this.cb(this.onFlush)
    }
  }
}
