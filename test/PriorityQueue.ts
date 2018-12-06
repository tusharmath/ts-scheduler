import * as assert from 'assert'
import {PriorityQueue} from '../src/PriorityQueue'

describe('PriorityQueue', () => {
  it('should allow push/pull', () => {
    const queue = new PriorityQueue<string>()
    queue.push(10, 'A')

    const actual = queue.pull()
    const expected = 'A'

    assert.equal(actual, expected)
  })

  it('should pull in sorted order', () => {
    const queue = new PriorityQueue<number>()
    queue
      .push(10, 10)
      .push(5, 5)
      .push(7, 7)

    const actual = queue.pull()
    const expected = 5

    assert.equal(actual, expected)
  })

  it('should pull only once', () => {
    const queue = new PriorityQueue<number>()
      .push(10, 10)
      .push(5, 5)
      .push(7, 7)
      .push(11, 11)
      .push(13, 13)
      .push(14, 14)
      .push(15, 15)

    queue.pull()
    const actual = queue.peek()
    const expected = 7

    assert.equal(actual, expected)
  })
})
