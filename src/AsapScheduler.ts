import {LinkedList, LinkedListNode} from 'dbl-linked-list-ds'
import {IScheduler} from './IScheduler'
import {Job} from './Job'
import {OnError} from './OnError'

type JobNode = [Job, OnError]

export class AsapScheduler implements IScheduler {
  private isFlushing = false
  private queue = new LinkedList<JobNode>()

  add(job: Job, onError: OnError): LinkedListNode<[Job, OnError]> {
    const id = this.queue.add([job, onError])
    this.flush()

    return id
  }

  remove(id: LinkedListNode<[Job, OnError]>): void {
    this.queue.remove(id)
  }

  private onFlush = () => {
    this.isFlushing = false
    let elm = this.queue.shift()

    while (elm !== undefined) {
      const [job, onError] = elm
      try {
        job()
      } catch (e) {
        onError(e)
      }
      elm = this.queue.shift()
    }
  }

  private flush(): void {
    if (!this.isFlushing) {
      this.isFlushing = true
      Promise.resolve().then(this.onFlush)
    }
  }
}
