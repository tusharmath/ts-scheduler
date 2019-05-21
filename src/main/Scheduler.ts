import {ICancellable} from '../cancellables/ICancellable'
import {NodeCancellable} from '../cancellables/NodeCancellable'
import {TimerCancellable} from '../cancellables/TimerCancellable'
import {IExecutable} from '../internals/IExecutable'
import {Ticker} from '../internals/Ticker'
import {IScheduler} from './IScheduler'

export class Scheduler implements IScheduler {
  private static onFlush(ctx: Scheduler): void {
    ctx.isFlushing = false
    while (ctx.queue.length > 0) {
      const job = ctx.queue.shift()
      if (job !== undefined) {
        job.execute()
      }
    }
  }

  private isFlushing = false
  private queue = new Array<IExecutable>()
  private currentTime = Date.now()
  constructor(private cb: Ticker<Scheduler>) {}

  /**
   * Compared to Promise.resolve() asap is a little better —
   * 1. This mimics the exact same behavior of Promise.resolve()
   * 2. It enables efficient cancellation of jobs.
   */
  asap(job: IExecutable): ICancellable {
    const id = this.queue.push(job) - 1
    this.flush()

    return new NodeCancellable(this.queue, id)
  }

  /**
   * Some sugar over the native setTimeout() functionality
   */
  delay(job: IExecutable, duration: number): ICancellable {
    const id = setTimeout(() => job.execute(), duration)
    return new TimerCancellable(id)
  }

  now(): number {
    return Date.now() - this.currentTime
  }

  private flush(): void {
    if (!this.isFlushing) {
      this.isFlushing = true
      this.cb(Scheduler.onFlush, this)
    }
  }
}
