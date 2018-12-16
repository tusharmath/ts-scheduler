import * as assert from 'assert'
import {minHeapifyDown, minHeapifyUp, parent, priorities, PriorityQueue, smallest, swap} from '../src/PriorityQueue'

describe('PriorityQueue', () => {
  const Q = (...t: number[]) => {
    const q = new PriorityQueue<number>()
    t.forEach(_ => q.push(_, _))
    return q
  }
  const cmp = (a: number, b: number) => a - b
  const randomNumbers = (n: number) => Array.from({length: n}, () => Math.round(Math.random() * n))
  const pullAll = <T>(q: PriorityQueue<T>) => {
    const result: T[] = []
    do {
      const r = q.pull()
      if (r !== undefined) {
        result.push(r)
      }
    } while (q.peek() !== undefined)
    return result
  }

  describe('parent()', () => {
    it('should return the parent value', () => {
      /**
       *         Sample Tree
       *              0
       *           /     \
       *          1       2
       *         / \     / \
       *        3   4   5   6
       */
      assert.strictEqual(parent(0), 0)
      assert.strictEqual(parent(1), 0)
      assert.strictEqual(parent(2), 0)
      assert.strictEqual(parent(3), 1)
      assert.strictEqual(parent(4), 1)
    })
  })

  describe('swap()', () => {
    it('should swap two elements', () => {
      // Create Input
      const actual = [1, 2]

      // Swap the elements
      swap(actual, 0, 1)
      const expected = [2, 1]

      // assert
      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('minHeapifyUp()', () => {
    it('should create a min heap (size 2)', () => {
      const actual = [10, 5]
      minHeapifyUp(actual, 1, cmp)

      const expected = [5, 10]
      assert.deepStrictEqual(actual, expected)
    })

    it('should recursively maintain min heap (size 3)', () => {
      const actual = [0, 1, -2]
      minHeapifyUp(actual, 2, cmp)

      const expected = [-2, 1, 0]
      assert.deepStrictEqual(actual, expected)
    })

    it('should recursively maintain min heap (size 4)', () => {
      const actual = [0, 1, 2, -3]
      minHeapifyUp(actual, 3, cmp)

      const expected = [-3, 0, 2, 1]
      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('minHeapifyDown()', () => {
    it('should heapify downwards', () => {
      assert.deepStrictEqual(minHeapifyDown([1], 0, cmp), [1])
      assert.deepStrictEqual(minHeapifyDown([2, 1], 0, cmp), [1, 2])
      assert.deepStrictEqual(minHeapifyDown([3, 1, 2], 0, cmp), [1, 3, 2])
      assert.deepStrictEqual(minHeapifyDown([3, 2, 1], 0, cmp), [1, 2, 3])
      assert.deepStrictEqual(minHeapifyDown([5, 1, 2, 3, 4], 0, cmp), [1, 3, 2, 5, 4])
      assert.deepStrictEqual(minHeapifyDown([5, 1, 2, 3, 4], 0, cmp), [1, 3, 2, 5, 4])
      assert.deepStrictEqual(minHeapifyDown([4, 3, 2], 0, cmp), [2, 3, 4])
    })
  })

  it('should insert elements into the queue', () => {
    const q = Q(1)
    const actual = priorities(q)
    const expected = [1]
    assert.deepStrictEqual(actual, expected)
  })

  it('should maintain min heap while inserting', () => {
    const q = Q(2, 1)
    const actual = priorities(q)
    const expected = [1, 2]
    assert.deepStrictEqual(actual, expected)
  })

  describe('pull()', () => {
    it('should pull in sorted order', () => {
      assert.deepStrictEqual(pullAll(Q(0, 2, 1)), [0, 1, 2])
      assert.deepStrictEqual(pullAll(Q(1, 0, 0)), [0, 0, 1])
      assert.deepStrictEqual(pullAll(Q(3, 0, 2, 4, 2)), [0, 2, 2, 3, 4])
    })

    it('should work with random values', () => {
      const input = randomNumbers(100)
      const q = Q(...input)
      const actual = pullAll(q)
      const expected = input.slice().sort(cmp)
      assert.deepStrictEqual(actual, expected)
    })

    it('should pull smallest value', () => {
      assert.equal(Q(1).pull(), 1)
      assert.equal(Q(2, 1).pull(), 1)
      assert.equal(Q(3, 2, 1).pull(), 1)
    })
  })
  describe('smallest()', () => {
    it('should return the smallest value', () => {
      assert.deepStrictEqual(smallest([1, 2, 3], 0, cmp), 1)
      assert.deepStrictEqual(smallest([1, 2], 0, cmp), 1)
      assert.deepStrictEqual(smallest([1], 0, cmp), 0)
      assert.deepStrictEqual(smallest([4, 3, 2], 0, cmp), 2)
    })
  })
  describe('isEmpty()', () => {
    it('should return true if the queue is empty', () => {
      const q = Q()
      assert.equal(q.isEmpty(), true)
    })

    it('should return false if the queue is NOT empty', () => {
      const q = Q(1)
      assert.equal(q.isEmpty(), false)
    })
  })
})
