import {ICancellable} from './ICancellable'
import Timeout = NodeJS.Timeout

export class TimerCancellable implements ICancellable {
  constructor(private readonly id: Timeout) {}

  cancel(): void {
    clearTimeout(this.id)
  }
}
