import {ICancellable} from '../cancellables/ICancellable'

/**
 * A simple job scheduler API.
 * You can add/remove jobs.
 */
export interface IScheduler {
  /**
   * Calls the function as soon as possible.
   * Its a replacement for `process.nextTick` and is also cancellable.
   * In non-node.js environments it fallbacks to various other techniques such as `setTimeout` or `Promise.resolve`.
   */
  asap<T extends unknown[]>(fn: (...t: T) => unknown, ...t: T): ICancellable

  /**
   * Works exactly like `setTimeout` but also returns a [[ICancellable]].
   * Schedules the job to run after a certain period of time.
   */
  delay<T extends unknown[], R>(
    fn: (...t: T) => R,
    duration: number,
    ...t: T
  ): ICancellable

  /**
   * Returns a virtualized version of the time.
   */
  now(): number
}
