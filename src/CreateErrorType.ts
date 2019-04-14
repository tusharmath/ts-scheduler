import {SchedulerError} from './SchedulerError'

/**
 * Utility function to create custom error types using functions instead of declaring classes.
 * This helps localize error types into that module instead of creating a directory of just errors.
 * @param cm
 * @constructor
 */
export const CreateErrorType = <T extends Array<unknown>>(
  cm: string | ((...t: T) => string)
) =>
  class extends SchedulerError {
    private readonly t: T

    constructor(...args: T) {
      super()
      this.t = args
    }

    protected createMessage(): string {
      return typeof cm === 'string' ? cm : cm(...this.t)
    }
  }