interface IQueueItem<T> {
  priority: number
  item: T
}

export class PriorityQueue<T = number> {
  private readonly queue: Array<IQueueItem<T>> = new Array<IQueueItem<T>>()

  public push(priority: number, item: T): PriorityQueue<T> {
    this.queue.push({item, priority})
    this.heapifyUP(this.queue.length - 1)
    return this
  }

  public pull(): T | undefined {
    const r = this.peek()
    const last = this.queue.pop()
    this.queue[0] = last as IQueueItem<T>
    this.heapifyDN(0)
    return r
  }

  public peek(): T | undefined {
    return this.queue[0].item
  }

  private heapifyUP(i: number): void {
    const parent = this.parent(i)
    if (this.queue[parent].priority > this.queue[i].priority) {
      this.swap(parent, i)
      this.heapifyUP(parent)
    }
  }

  private left(i: number): number {
    return i * 2 + 1
  }

  private right(i: number): number {
    return i * 2 + 2
  }

  private parent(i: number): number {
    return Math.floor(i / 2)
  }

  private swap(a: number, b: number): void {
    const A = this.queue[a]
    const B = this.queue[b]
    this.queue[b] = A
    this.queue[a] = B
  }

  // private debugQueue() {
  //   return this.queue.map(_ => _.priority)
  // }

  private heapifyDN(i: number): void {
    const iL = this.left(i)
    const iR = this.right(i)

    if (iL >= this.queue.length || iR >= this.queue.length) {
      return
    }

    const left = this.queue[iL]
    const right = this.queue[iR]
    const smallerChildIndex = left.priority < right.priority ? iL : iR
    this.swap(i, smallerChildIndex)
    this.heapifyDN(smallerChildIndex)
  }
}
