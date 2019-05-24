import {Ticker} from '../internals/Ticker'
import {ICancellable} from './ICancellable'

/**
 * Triggers a callback and maintains cancellation context.
 * @ignore
 */
export class CancelCB<T extends unknown[]> implements ICancellable {
  private isCancelled = false
  constructor(cb: Ticker, fn: (...t: T) => unknown, args: T) {
    cb(this.onTick, this, fn, args)
  }

  cancel(): void {
    this.isCancelled = true
  }

  private onTick(ctx: CancelCB<T>, fn: (...t: T) => unknown, args: T): void {
    if (!ctx.isCancelled) {
      fn.apply(undefined, args)
    }
  }
}
