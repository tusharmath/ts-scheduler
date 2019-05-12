/* tslint:disable:max-classes-per-file */
import {IExecutable} from '../../src/internals/IExecutable'
import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

class J implements IExecutable {
  constructor(private readonly d: BMDeferred) {}
  execute(): void {
    this.d.resolve()
  }
}

class N implements IExecutable {
  constructor(
    private readonly j: IExecutable,
    private readonly S: IScheduler
  ) {}
  execute(): void {
    this.S.asap(this.j)
  }
}
export const CreateNestedAsapJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  let job: IExecutable = new J(d)
  while (count-- > 0) {
    job = new N(job, S)
  }

  S.asap(new N(job, S))
}
