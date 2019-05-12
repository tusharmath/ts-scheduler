import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

export const CreateNestedAsapJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  let job = () => d.resolve()
  while (count-- > 0) {
    const nJob = job
    job = () => S.asap(nJob)
  }

  S.asap(job)
}
