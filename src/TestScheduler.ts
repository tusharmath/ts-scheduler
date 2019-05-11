import {check} from 'checked-exceptions'
import {LinkedList} from 'dbl-linked-list-ds'
import {Bailout} from './Bailout'
import {Cancel} from './Cancel'
import {IScheduler} from './IScheduler'
import {Job} from './Job'

/**
 * Thrown when run() is called twice during the same loop.
 */
export const ForbiddenNestedRun = check(
  'ForbiddenNestedRun',
  () => 'calling scheduler.run() inside a scheduled job is forbidden'
)

/**
 * 1. The scheduler runs based on "ticks"
 * 2. A special value called "nextTick" is maintained.
 * 3. nextTick is increased when everything for the current tick is completed.
 * 4. Asap uses nextTick to schedule work.
 */
export class TestScheduler implements IScheduler {
  public nextTick = 1

  private time: number = 0
  private Q = new Map<number, LinkedList<Job>>()
  private jobCount = 0
  private isRunning = false

  asap(job: Job): Cancel {
    this.jobCount++
    return this.insert(this.nextTick, job)
  }

  delay(job: Job, duration: number): Cancel {
    this.jobCount++
    return this.insert(this.now() + duration, job)
  }

  now(): number {
    return this.time
  }

  run(): void {
    if (!this.isRunning) {
      this.isRunning = true
      const checker = Bailout()
      while (this.jobCount > 0 && checker()) {
        this.tick()
      }
      this.isRunning = false
    } else {
      throw new ForbiddenNestedRun()
    }
  }

  runTo(n: number): void {
    const checker = Bailout()
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

  private getList(seq: number): LinkedList<Job> {
    const ll = this.Q.get(seq)
    if (ll) {
      return ll
    }
    const linkedList = new LinkedList<Job>()
    this.Q.set(seq, linkedList)
    return linkedList
  }

  private insert(time: number, job: Job): Cancel {
    const list = this.getList(time)
    const id = list.add(job)

    return () => {
      this.jobCount--
      list.remove(id)
    }
  }

  private flush(): void {
    const checker = Bailout()
    const tick = this.time
    const qElement = this.Q.get(tick)
    while (qElement && qElement.length > 0 && checker()) {
      const headElement = qElement.head()
      if (headElement) {
        headElement.value()
        qElement.remove(headElement)
        this.jobCount--
      }
    }
    this.Q.delete(tick)
  }
}
