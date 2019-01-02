import {Cancel} from './Cancel'
import {Dispatcher} from './Dispatcher'

export class IdleDispatcher implements Dispatcher {
  private id?: number
  private idleDeadline?: IdleDeadline

  public dispatch(cb: () => void): Cancel {
    this.id = requestIdleCallback(idle => {
      this.idleDeadline = idle
    })

    return () => {
      if (this.id) {
        cancelIdleCallback(this.id)
      }
    }
  }

  public continue(): boolean {
    if (this.idleDeadline !== undefined) {
      return !this.idleDeadline.didTimeout
    }

    return false
  }
}
