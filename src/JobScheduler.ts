import {Cancel} from './Cancel'
import {IDispatcher} from './IDispatcher'
import {Job} from './Job'

type JobItem = [Job, boolean]
export class JobScheduler {
  private cancel?: Cancel
  private readonly queue: JobItem[] = []
  private requestedCallback = false
  public constructor(private readonly dispatcher: IDispatcher) {}

  public abort(): void {
    if (this.cancel !== undefined) {
      this.cancel()
    }
  }

  public enqueue(job: Job): Cancel {
    const item: JobItem = [job, true]
    this.queue.push(item)
    this.flush()

    return () => (item[1] = false)
  }

  private flush(): void {
    if (this.queue.length > 0 && !this.requestedCallback) {
      this.requestedCallback = true
      this.cancel = this.dispatcher.dispatch(this.onFlush)
    }
  }

  private readonly onFlush = (): void => {
    this.requestedCallback = false

    while (this.queue.length > 0 && this.dispatcher.continue()) {
      const item = this.queue.shift()
      if (item !== undefined) {
        const [job, enabled] = item
        if (enabled) {
          job()
        }
      }
    }

    this.flush()
  }
}
