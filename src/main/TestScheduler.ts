import {check} from 'checked-exceptions'
import {DoublyLinkedList, Option} from 'standard-data-structures'
import {ICancellable} from '../cancellables/ICancellable'
import {Bailout} from '../internals/Bailout'

import {IFnArg} from '../internals/IFnArgs'
import {IScheduler} from './IScheduler'
import {ITestSchedulerOptions} from './ITestSchedulerOptions'

/**
 * Thrown when run() is called twice during the same loop.
 * @ignore
 */
export const ForbiddenNestedRun = check(
  'ForbiddenNestedRun',
  () => 'calling scheduler.run() inside a scheduled job is forbidden'
)

const DEFAULT_SCHEDULER_OPTIONS: ITestSchedulerOptions = {
  bailout: 100
}

/**
 * TestScheduler tries to mimic the javascript event loop and provides a low level API
 * to manage the queue. You add add/remove new callbacks also run and then pause
 * the execution for sometime.
 */
export class TestScheduler implements IScheduler {
  public nextTick = 1

  private time: number = 0
  private Q = new Map<number, DoublyLinkedList<IFnArg<unknown[]>>>()
  private isRunning = false
  private options: ITestSchedulerOptions

  constructor(options: Partial<ITestSchedulerOptions>) {
    this.options = {
      ...DEFAULT_SCHEDULER_OPTIONS,
      ...options
    }
  }

  asap<T extends unknown[]>(
    fn: (...t: T) => unknown,
    ...args: T
  ): ICancellable {
    return this.insert(this.nextTick, {fn, args})
  }

  delay<T extends unknown[]>(
    fn: (...t: T) => unknown,
    duration: number,
    ...args: T
  ): ICancellable {
    return this.insert(this.now() + duration, {fn, args})
  }

  now(): number {
    return this.time
  }

  run(): void {
    if (!this.isRunning) {
      this.isRunning = true
      const checker = Bailout(this.options.bailout)
      while (this.hasJob() && checker()) {
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

  private hasJob(): boolean {
    for (const _ of this.Q) {
      if (_[1].length > 0) {
        return true
      }
    }
    return false
  }

  private tick(): void {
    this.time++
    this.flush()
    this.nextTick = this.time + 1
  }

  private getList(seq: number): DoublyLinkedList<IFnArg<unknown[]>> {
    const ll = this.Q.get(seq)
    if (ll) {
      return ll
    }
    const linkedList = DoublyLinkedList.of<IFnArg<unknown[]>>()
    this.Q.set(seq, linkedList)
    return linkedList
  }

  private insert<T extends unknown[]>(
    time: number,
    job: IFnArg<T>
  ): ICancellable {
    const list = this.getList(time)
    const id = list.add(job)

    return {
      cancel: () => {
        list.remove(id)
      }
    }
  }

  private flush(): void {
    const checker = Bailout(this.options.bailout)
    const tick = this.time
    const qElement = this.Q.get(tick)

    while (qElement && qElement.length > 0 && checker()) {
      const headElement = qElement.shift()
      if (Option.isSome(headElement)) {
        headElement.value.fn(...headElement.value.args)
      }
    }
    this.Q.delete(tick)
  }
}
