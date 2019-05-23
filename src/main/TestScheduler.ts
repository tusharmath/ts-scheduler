import {check} from 'checked-exceptions'
import {LinkedList} from 'dbl-linked-list-ds'
import {ICancellable} from '../cancellables/ICancellable'
import {Bailout} from '../internals/Bailout'
import {IExecutable} from '../internals/IExecutable'
import {IScheduler} from './IScheduler'

/**
 * Thrown when run() is called twice during the same loop.
 * @ignore
 */
export const ForbiddenNestedRun = check(
  'ForbiddenNestedRun',
  () => 'calling scheduler.run() inside a scheduled job is forbidden'
)

/**
 * Options to configure the test scheduler
 * @ignore
 */
export type TestSchedulerOptions = {
  bailout: number
}

const DEFAULT_SCHEDULER_OPTIONS: TestSchedulerOptions = {
  bailout: 100
}

/**
 * 1. The scheduler runs based on "ticks"
 * 2. A special value called "nextTick" is maintained.
 * 3. nextTick is increased when everything for the current tick is completed.
 * 4. Asap uses nextTick to schedule work.
 */
export class TestScheduler implements IScheduler {
  public nextTick = 1

  private time: number = 0
  private Q = new Map<number, LinkedList<IExecutable>>()
  private jobCount = 0
  private isRunning = false
  private options: TestSchedulerOptions

  constructor(options: Partial<TestSchedulerOptions>) {
    this.options = {
      ...DEFAULT_SCHEDULER_OPTIONS,
      ...options
    }
  }

  asap(job: IExecutable): ICancellable {
    this.jobCount++
    return this.insert(this.nextTick, job)
  }

  delay(job: IExecutable, duration: number): ICancellable {
    this.jobCount++
    return this.insert(this.now() + duration, job)
  }

  now(): number {
    return this.time
  }

  run(): void {
    if (!this.isRunning) {
      this.isRunning = true
      const checker = Bailout(this.options.bailout)
      while (this.jobCount > 0 && checker()) {
        this.tick()
      }
      this.isRunning = false
    } else {
      throw new ForbiddenNestedRun()
    }
  }

  runTo(n: number): void {
    const checker = Bailout(this.options.bailout)
    while (this.now() < n && checker()) {
      this.tick()
    }
  }

  runBy(n: number): void {
    this.runTo(this.now() + n)
  }

  private tick(): void {
    this.time++
    this.flush()
    this.nextTick = this.time + 1
  }

  private getList(seq: number): LinkedList<IExecutable> {
    const ll = this.Q.get(seq)
    if (ll) {
      return ll
    }
    const linkedList = new LinkedList<IExecutable>()
    this.Q.set(seq, linkedList)
    return linkedList
  }

  private insert(time: number, job: IExecutable): ICancellable {
    const list = this.getList(time)
    const id = list.add(job)

    return {
      cancel: () => {
        this.jobCount--
        list.remove(id)
      }
    }
  }

  private flush(): void {
    const checker = Bailout(this.options.bailout)
    const tick = this.time
    const qElement = this.Q.get(tick)
    while (qElement && qElement.length > 0 && checker()) {
      const headElement = qElement.head()
      if (headElement) {
        headElement.value.execute()
        qElement.remove(headElement)
        this.jobCount--
      }
    }
    this.Q.delete(tick)
  }
}
