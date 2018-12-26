declare function requestIdleCallback(cb: (idle: IdleDeadline) => any): number
declare function cancelIdleCallback(id: number): void
interface IdleDeadline {
  didTimeout: boolean
  timeRemaining(): number
}
