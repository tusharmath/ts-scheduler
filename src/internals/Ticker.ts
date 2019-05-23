/**
 * Type of a ticker
 * @ignore
 */
export type Ticker<A> = (cb: (ctx: A) => void, ctx: A) => void
