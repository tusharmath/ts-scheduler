import {LinkedList, LinkedListNode} from 'dbl-linked-list-ds'
import {ICancellable} from './ICancellable'

export class NodeCancellable<T> implements ICancellable {
  constructor(
    private readonly queue: LinkedList<T>,
    private readonly id: LinkedListNode<T>
  ) {}

  cancel(): void {
    this.queue.remove(this.id)
  }
}
