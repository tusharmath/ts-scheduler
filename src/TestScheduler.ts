import {LinkedList} from 'dbl-linked-list-ds'
import {Cancel} from './Cancel'
import {IScheduler} from './IScheduler'
import {Job} from './Job'

type Time = number
export class TestScheduler implements IScheduler {
  private Q = new LinkedList<[Job, Time]>()
  private time = 0

  asap(job: Job): Cancel {
    const id = this.Q.add([job, this.now() + 1])
    return () => this.Q.remove(id)
  }

  delay(job: Job, duration: number): Cancel {
    const id = this.Q.add([job, this.now() + duration])
    return () => this.Q.remove(id)
  }

  now(): number {
    return this.time
  }

  tick(): void {
    this.time++
    this.flush()
  }

  run(): void {
    while (this.Q.length > 0) {
      this.tick()
    }
  }

  runTo(n: Time): void {
    while (this.now() <= n) {
      this.tick()
    }
  }

  runBy(n: Time): void {
    this.runTo(this.now() + n)
  }

  private flush(): void {
    const head = this.Q.head()
    if (head && head.value[1] === this.now()) {
      this.Q.shift()
      head.value[0]()
    }
  }
}
