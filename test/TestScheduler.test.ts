import {assert} from 'chai'
import {BailoutError} from '../src/internals/Bailout'

import {testScheduler} from '..'
import {ForbiddenNestedRun} from '../src/main/TestScheduler'

describe('TestScheduler', () => {
  describe('asap()', () => {
    it('should run on the time', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.asap(() => marker.push(S.now()))
      S.run()
      assert.strictEqual(S.now(), 1)
      assert.deepStrictEqual(marker, [1])
    })

    it('should call with args', () => {
      const marker: unknown[] = []
      const S = testScheduler()
      S.asap((a, b) => marker.push(a, b), 1, 'Happy')
      S.run()

      assert.deepStrictEqual(marker, [1, 'Happy'])
    })

    it('should cancel', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.asap(() => marker.push(S.now())).cancel()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })

    it('should batch multiple jobs', () => {
      const marker = new Array<[string, number]>()
      const S = testScheduler()
      S.asap(() => marker.push(['A', S.now()]))
      S.asap(() => marker.push(['B', S.now()]))
      S.run()
      assert.deepStrictEqual(marker, [['A', 1], ['B', 1]])
    })

    it('should maintain order for nested callbacks', () => {
      const marker = new Array<[string, number]>()
      const S = testScheduler()
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
      const S = testScheduler()
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
      const S = testScheduler()
      S.runTo(100)
      assert.strictEqual(S.now(), 100)

      // scheduled for 101
      S.asap(() => marker.push('A' + S.now()))

      S.run()
      assert.deepStrictEqual(marker, ['A101'])
    })

    it('should reduce jobCount by one', () => {
      const marker = new Array<number>()
      const S = testScheduler({bailout: Infinity})
      const j1 = S.asap(() => {
        marker.push(1)
        j1.cancel()
      })

      S.asap(() => {
        marker.push(2)
      })

      S.run()
      assert.deepStrictEqual(marker, [1, 2])
    })
  })

  describe('delay()', () => {
    it('should run on timeout', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.delay(() => marker.push(S.now()), 5000)
      S.run()
      assert.strictEqual(S.now(), 5000)
      assert.deepStrictEqual(marker, [5000])
    })

    it('should call with args', () => {
      const marker: unknown[] = []
      const S = testScheduler()
      S.delay((a, b) => marker.push(a, b), 1000, 1, 'Happy')
      S.run()
      assert.strictEqual(S.now(), 1000)
      assert.deepStrictEqual(marker, [1, 'Happy'])
    })

    it('should cancel', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.delay(() => marker.push(S.now()), 1000).cancel()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })

    it('should not schedule for passed time', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.delay(() => marker.push(S.now()), -100).cancel()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })
  })

  describe('runTo()', () => {
    it('should run till the given time', () => {
      const S = testScheduler()
      S.runTo(10)
      const actual = S.now()
      const expected = 10

      assert.strictEqual(actual, expected)
    })
  })

  describe('run()', () => {
    it('should tick once', () => {
      const S = testScheduler()
      S.asap(() => void 0)
      S.run()
      assert.strictEqual(S.now(), 1)
    })

    it('should not tick once if nothing is scheduled', () => {
      const S = testScheduler()
      S.run()
      assert.strictEqual(S.now(), 0)
    })

    it('should not bailout on calling run multiple times', () => {
      const S = testScheduler()
      S.delay(() => assert.doesNotThrow(() => S.run(), BailoutError), 10)
      S.run()
    })

    it('should throw on running multiple times', () => {
      const S = testScheduler()
      S.delay(() => assert.throws(() => S.run(), ForbiddenNestedRun), 10)
      S.run()
    })

    it('should not throw when run is called in a different context', () => {
      const S = testScheduler()
      S.run()
      assert.doesNotThrow(() => S.run(), ForbiddenNestedRun)
    })
  })

  describe('nextTick', () => {
    it('should be 1 in the beginning', () => {
      const S = testScheduler()
      assert.strictEqual(S.nextTick, 1)
    })

    it('should be 1+ the current time', () => {
      const S = testScheduler()
      S.runTo(100)
      assert.strictEqual(S.nextTick, 101)
    })
  })
})
