import {Cancel} from './Cancel'
import {Dispatcher} from './Dispatcher'

class IdleDispatcher implements Dispatcher {
  private id?: number
  private idleDeadline?: IdleDeadline

  public dispatch(cb: () => void): Cancel {
    this.id = requestIdleCallback(deadline => {
      this.idleDeadline = deadline
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

export const idle = (): Dispatcher => new IdleDispatcher()
