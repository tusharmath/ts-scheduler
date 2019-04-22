import {SchedulerError} from './SchedulerError'

/**
 * Utility function to create custom error types using functions instead of declaring classes.
 * This helps localize error types into that module instead of creating a directory of just errors.
 * @param cm
 * @constructor
 */
export const CreateErrorType = <T extends unknown[]>(
  cm: string | ((...t: T) => string)
) =>
  class extends SchedulerError {
    /**
     * FIXME: args should be `private`
     * Bug Reported: https://github.com/Microsoft/TypeScript/issues/17293
     */
    public readonly args: T

    constructor(...args: T) {
      super()
      this.args = args
    }

    /**
     * FIXME: createMessage could be `private` ???
     * Bug Reported: https://github.com/Microsoft/TypeScript/issues/17293
     */
    public createMessage(): string {
      return typeof cm === 'string' ? cm : cm(...this.args)
    }
  }
