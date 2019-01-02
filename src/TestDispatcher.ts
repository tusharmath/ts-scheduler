import {Cancel} from './Cancel'
import {Dispatcher} from './Dispatcher'

export class TestDispatcher implements Dispatcher {
  private enabled = true
  private time = 0
  private tasks: Array<[number, () => void]> = []

  constructor(private dispatchTime: number = 10) {}

  public continue(): boolean {
    return this.enabled
  }

  public disable(): void {
    this.enabled = false
  }

  public enable(): void {
    this.enabled = true
  }

  public dispatch(cb: () => void): Cancel {
    this.tasks.push([this.dispatchTime + this.now(), cb])
    return () => (this.tasks = this.tasks.filter(_ => _[1] !== cb))
  }

  public tick(): void {
    this.time++
    this.pull()
  }

  public move(time: number): void {
    while (this.now() !== time) {
      this.tick()
    }
  }

  public moveToEnd(): void {
    while (this.tasks.length > 0) {
      this.tick()
    }
  }

  public moveBy(duration: number): void {
    this.move(this.now() + duration)
  }

  public now(): number {
    return this.time
  }

  private pull(): void {
    if (this.tasks.length > 0 && this.tasks[0][0] === this.time) {
      this.tasks[0][1]()
      this.tasks.shift()
    }
  }
}
