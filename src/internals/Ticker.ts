/**
 * Type of a ticker
 * @ignore
 */
export type Ticker = <T extends unknown[]>(
  cb: (...t: T) => void,
  ...args: T
) => void
