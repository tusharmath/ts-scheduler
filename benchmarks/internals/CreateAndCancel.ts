import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

export const CreateAndCancelJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  S.asap(() => void 0).cancel()
  d.resolve()
}
