import {Cancel} from './Cancel'
import {Dispatcher} from './Dispatcher'

export class AsapDispatcher implements Dispatcher {
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
