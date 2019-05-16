/**
 * Type of a ticker
 */
export type Ticker<A> = (cb: (ctx: A) => void, ctx: A) => void
