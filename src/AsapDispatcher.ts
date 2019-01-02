import {Cancel} from './Cancel'
import {Dispatcher} from './Dispatcher'

class AsapDispatcher implements Dispatcher {
  private enabled = false

  public continue(): boolean {
    return this.enabled
  }

  public dispatch(cb: () => void): Cancel {
    Promise.resolve(() => {
      if (this.enabled) {
        cb()
      }
    }).catch(cb)

    return () => (this.enabled = false)
  }
}

export const asap = (): Dispatcher => new AsapDispatcher()
