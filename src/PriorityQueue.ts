export interface IQueueItem<T> {
  priority: number
  item: T
}

type Queue<T> = Array<IQueueItem<T>>

/**
 * Returns a - b in case of numbers
 * ie. a > b ? +1
 *     a < b ? -1
 *     a = b ?  0
 */
type Comparer<T> = (a: T, b: T) => number

/**
 * Creates a min heap
 */
export function minHeapifyUp<T>(q: T[], i: number, cmp: Comparer<T>): void {
  let iParent = parent(i)
  let n = i
  while (cmp(q[n], q[iParent]) < 0) {
    swap(q, n, iParent)
    n = iParent
    iParent = parent(n)
  }
}

export function smallest<T>(q: T[], i: number, cmp: Comparer<T>): number {
  const len = q.length
  const iLeft = left(i)
  const iRight = right(i)
  if (iLeft < len && iRight < len) {
    return cmp(q[iLeft], q[iRight]) > 0 ? iRight : iLeft
  }
  if (iRight < len) {
    return iRight
  }
  if (iLeft < len) {
    return iLeft
  }
  return i
}

export function minHeapifyDown<T>(q: T[], i: number, cmp: Comparer<T>): T[] {
  let n = i
  let iSmallest = smallest(q, n, cmp)
  while (cmp(q[iSmallest], q[n]) < 0) {
    swap(q, iSmallest, n)
    n = iSmallest
    iSmallest = smallest(q, n, cmp)
  }
  return q
}

export function left(i: number): number {
  return i * 2 + 1
}

export function right(i: number): number {
  return i * 2 + 2
}

/**
 * Swaps two elements in an array
 */
export function swap<T>(q: T[], a: number, b: number): void {
  const [aItem, bItem] = [q[a], q[b]]
  q[a] = bItem
  q[b] = aItem
}

/**
 * Returns the parent index in a heap
 */
export function parent(i: number): number {
  return i === 0 ? 0 : Math.floor((i - 1) / 2)
}

export function priorities<T>(q: PriorityQueue<T>): number[] {
  return q.queue.map(_ => _.priority)
}

export function queueComparer<T>(a: IQueueItem<T>, b: IQueueItem<T>): number {
  return a.priority - b.priority
}
export class PriorityQueue<T = number> {
  public readonly queue: Queue<T> = new Array<IQueueItem<T>>()
  public push(priority: number, item: T): PriorityQueue<T> {
    this.queue.push({priority, item})
    minHeapifyUp(this.queue, this.queue.length - 1, queueComparer)
    return this
  }

  public peek(): T | undefined {
    if (this.queue.length === 0) {
      return undefined
    }
    return this.queue[0].item
  }

  public pull(): T | undefined {
    const r = this.peek()
    const i = this.queue.pop()

    if (i !== undefined && this.queue.length > 0) {
      this.queue[0] = i
      minHeapifyDown(this.queue, 0, queueComparer)
    }
    return r
  }
}
