import {Cancel} from './Cancel'
import {IDispatcher} from './IDispatcher'

export class AsapDispatcher implements IDispatcher {
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
