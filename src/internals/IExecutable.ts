/**
 * Represents a unit of work that can be scheduled using [[IScheduler.asap]]
 */
export interface IExecutable {
  execute(): void
}
