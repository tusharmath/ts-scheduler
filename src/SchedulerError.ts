/**
 * Created by tushar on 2019-04-14
 */

export abstract class SchedulerError extends Error {
  protected abstract createMessage(): string
  get message(): string {
    return this.constructor.name + ': ' + this.createMessage()
  }
}
