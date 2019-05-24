/**
 * Created by tushar on 2019-03-20
 */

import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

class Counter {
  constructor(private count: number, private readonly d: BMDeferred) {}

  public dec(): void {
    this.count--
    if (this.count === 0) {
      this.d.resolve()
    }
  }
}

export const CreateParallelJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  const counter = new Counter(count, d)
  while (count-- > 0) {
    S.asap(() => counter.dec())
  }
}
