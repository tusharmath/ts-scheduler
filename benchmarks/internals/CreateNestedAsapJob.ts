/* tslint:disable:max-classes-per-file */
import {IJob} from '../../src/internals/IJob'
import {Job} from '../../src/internals/Job'
import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

class J implements IJob {
  constructor(private readonly d: BMDeferred) {}
  execute(): void {
    this.d.resolve()
  }
}

class N implements IJob {
  constructor(private readonly j: IJob, private readonly S: IScheduler) {}
  execute(): void {
    this.S.asap(this.j)
  }
}
export const CreateNestedAsapJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  let job: IJob = new J(d)
  while (count-- > 0) {
    job = new N(job, S)
  }

  S.asap(new N(job, S))
}
