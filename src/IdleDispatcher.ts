import {Cancel} from './Cancel'
import {IDispatcher} from './IDispatcher'

export class IdleDispatcher implements IDispatcher {
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
