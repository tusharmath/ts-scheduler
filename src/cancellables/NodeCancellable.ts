import {IExecutable} from '../internals/IExecutable'
import {ICancellable} from './ICancellable'

/**
 * @ignore
 */

export class NodeCancellable implements ICancellable {
  constructor(
    private readonly queue: IExecutable[],
    private readonly id: number
  ) {}

  cancel(): void {
    this.queue.splice(this.id, 1)
  }
}
