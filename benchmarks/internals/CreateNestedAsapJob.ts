import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

export const CreateNestedAsapJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  let job = (i: number) => {
    d.resolve()
  }

  while (count-- > 0) {
    const pJob = job
    job = (i: number) => {
      S.asap(pJob, i + 1)
    }
  }

  S.asap(job, 0)
}
