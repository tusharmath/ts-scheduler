/* tslint:disable:max-classes-per-file */
/**
 * Created by tushar on 2019-03-20
 */

import {IJob} from '../../src/internals/IJob'
import {Job} from '../../src/internals/Job'
import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

class Counter {
  constructor(private count: number) {}

  public dec(): void {
    this.count--
  }

  public isZero(): boolean {
    return this.count === 0
  }
}
class P implements IJob {
  constructor(
    private readonly counter: Counter,
    private readonly d: BMDeferred
  ) {}
  execute(): void {
    this.counter.dec()
    if (this.counter.isZero()) {
      this.d.resolve()
    }
  }
}
export const CreateParallelJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  const counter = new Counter(count)
  while (count-- > 0) {
    S.asap(new P(counter, d))
  }
}
