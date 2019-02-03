import * as assert from 'assert'
import {TestScheduler} from '../src/TestScheduler'

describe.only('TestScheduler', () => {
  describe('asap()', () => {
    it('should run on the nextTick', () => {
      const marker: number[] = []
      const S = new TestScheduler()
      S.asap(() => marker.push(S.now()))
      S.run()
      assert.strictEqual(S.now(), 1)
      assert.deepStrictEqual(marker, [1])
    })

    it('should cancel', () => {
      const marker: number[] = []
      const S = new TestScheduler()
      S.asap(() => marker.push(S.now()))()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })
  })

  describe('delay()', () => {
    it('should run on timeout', () => {
      const marker: number[] = []
      const S = new TestScheduler()
      S.delay(() => marker.push(S.now()), 5000)
      S.run()
      assert.strictEqual(S.now(), 5000)
      assert.deepStrictEqual(marker, [5000])
    })

    it('should cancel', () => {
      const marker: number[] = []
      const S = new TestScheduler()
      S.delay(() => marker.push(S.now()), 1000)()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })
  })
})
