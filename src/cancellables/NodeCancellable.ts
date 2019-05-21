import {ICancellable} from './ICancellable'

export class NodeCancellable<T> implements ICancellable {
  constructor(private readonly queue: T[], private readonly id: number) {}

  cancel(): void {
    this.queue.splice(this.id, 1)
  }
}
