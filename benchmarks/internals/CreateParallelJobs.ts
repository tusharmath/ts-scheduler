/**
 * Created by tushar on 2019-03-20
 */

import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

export const CreateParallelJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  let i = count
  const check = () => {
    i--
    if (i === 0) {
      d.resolve()
    }
  }

  while (count-- > 0) {
    S.asap(check)
  }
}
