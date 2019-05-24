import {CancelCB} from '../cancellables/CancelCB'
import {ICancellable} from '../cancellables/ICancellable'
import {TimerCancellable} from '../cancellables/TimerCancellable'
import {Ticker} from '../internals/Ticker'
import {IScheduler} from './IScheduler'

/**
 * Default Scheduler
 */
export class Scheduler implements IScheduler {
  private currentTime = Date.now()
  constructor(private cb: Ticker) {}

  /**
   * Compared to Promise.resolve() asap is a little better —
   * 1. This mimics the exact same behavior of Promise.resolve()
   * 2. It enables efficient cancellation of jobs.
   */
  asap<T extends unknown[]>(
    fn: (...t: T) => unknown,
    ...args: T
  ): ICancellable {
    return new CancelCB(this.cb, fn, args)
  }

  /**
   * Some sugar over the native setTimeout() functionality
   */
  delay<T extends unknown[]>(
    fn: (...t: T) => unknown,
    duration: number,
    ...args: T
  ): ICancellable {
    const id = setTimeout(fn, duration, ...args)
    return new TimerCancellable(id)
  }

  now(): number {
    return Date.now() - this.currentTime
  }
}
