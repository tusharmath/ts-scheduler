import {Cancel} from './Cancel'
import {Dispatcher} from './Dispatcher'

// tslint:disable-next-line: no-empty
const unstoppable = () => {}

class NowDispatcher implements Dispatcher {
  public continue(): boolean {
    return false
  }

  public dispatch(cb: () => void): Cancel {
    cb()
    return unstoppable
  }
}

export const now = (): Dispatcher => new NowDispatcher()
