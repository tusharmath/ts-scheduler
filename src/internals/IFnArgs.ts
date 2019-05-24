export interface IFnArg<T extends unknown[]> {
  args: T
  fn(...t: T): unknown
}
