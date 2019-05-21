import {IExecutable} from '../../src/internals/IExecutable'
import {IScheduler} from '../../src/main/IScheduler'
import {BMDeferred} from './BMDeferred'

class Resolver implements IExecutable {
  // tslint:disable-next-line: no-empty
  execute(): void {}
}

export const CreateAndCancelJob = (
  S: IScheduler,
  count: number,
  d: BMDeferred
) => {
  S.asap(new Resolver()).cancel()
  d.resolve()
}
