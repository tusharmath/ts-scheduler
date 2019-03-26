import * as assert from 'assert'
import {TestScheduler} from '../src/TestScheduler'

describe('TestScheduler', () => {
  describe('asap()', () => {
    it('should run on the time', () => {
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

    it('should batch multiple jobs', () => {
      const marker = new Array<[string, number]>()
      const S = new TestScheduler()
      S.asap(() => marker.push(['A', S.now()]))
      S.asap(() => marker.push(['B', S.now()]))
      S.run()
      assert.deepStrictEqual(marker, [['A', 1], ['B', 1]])
    })

    it('should maintain order for nested callbacks', () => {
      const marker = new Array<[string, number]>()
      const S = new TestScheduler()
      S.asap(() => {
        marker.push(['A', S.now()])
        S.asap(() => marker.push(['B', S.now()]))
      })
      S.asap(() => marker.push(['C', S.now()]))
      S.run()
      assert.deepStrictEqual(marker, [['A', 1], ['C', 1], ['B', 1]])
    })

    it('should flush everything before the next tick', () => {
      const marker = new Array<string>()
      const S = new TestScheduler()
      S.asap(() => {
        marker.push('A' + S.now())
        S.asap(() => {
          marker.push('B' + S.now())
          S.asap(() => {
            marker.push('C' + S.now())
            S.asap(() => {
              marker.push('D' + S.now())
            })
          })
        })
      })
      S.run()
      assert.deepStrictEqual(marker, ['A1', 'B1', 'C1', 'D1'])
    })

    it('should schedule for current tick', () => {
      const marker = new Array<string>()
      const S = new TestScheduler()
      S.runTo(100)
      assert.strictEqual(S.now(), 100)

      // scheduled for 101
      S.asap(() => marker.push('A' + S.now()))

      S.run()
      assert.deepStrictEqual(marker, ['A101'])
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

    it('should not schedule for passed time', () => {
      const marker: number[] = []
      const S = new TestScheduler()
      S.delay(() => marker.push(S.now()), -100)()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })
  })

  describe('runTo()', () => {
    it('should run till the given time', () => {
      const S = new TestScheduler()
      S.runTo(10)
      const actual = S.now()
      const expected = 10

      assert.strictEqual(actual, expected)
    })
  })

  describe('run()', () => {
    it('should tick once', () => {
      const S = new TestScheduler()
      S.asap(() => void 0)
      S.run()
      assert.strictEqual(S.now(), 1)
    })

    it('should not tick once if nothing is scheduled', () => {
      const S = new TestScheduler()
      S.run()
      assert.strictEqual(S.now(), 0)
    })
  })

  describe('nextTick', () => {
    it('should be 1 in the beginning', () => {
      const S = new TestScheduler()
      assert.strictEqual(S.nextTick, 1)
    })

    it('should be 1+ the current time', () => {
      const S = new TestScheduler()
      S.runTo(100)
      assert.strictEqual(S.nextTick, 101)
    })
  })
})
