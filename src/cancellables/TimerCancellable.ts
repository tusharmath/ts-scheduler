import {ICancellable} from './ICancellable'

/**
 * @ignore
 */
export class TimerCancellable implements ICancellable {
  constructor(private readonly id: number) {}

  cancel(): void {
    clearTimeout(this.id)
  }
}
