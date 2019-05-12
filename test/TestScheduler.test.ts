import {assert} from 'chai'
import {BailoutError} from '../src/internals/Bailout'
import {Executable} from '../src/internals/Executable'
import {ForbiddenNestedRun, TestScheduler} from '../src/main/TestScheduler'
import {testScheduler} from '../test'

describe('TestScheduler', () => {
  describe('asap()', () => {
    it('should run on the time', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.asap(new Executable(() => marker.push(S.now())))
      S.run()
      assert.strictEqual(S.now(), 1)
      assert.deepStrictEqual(marker, [1])
    })

    it('should cancel', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.asap(new Executable(() => marker.push(S.now()))).cancel()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })

    it('should batch multiple jobs', () => {
      const marker = new Array<[string, number]>()
      const S = testScheduler()
      S.asap(new Executable(() => marker.push(['A', S.now()])))
      S.asap(new Executable(() => marker.push(['B', S.now()])))
      S.run()
      assert.deepStrictEqual(marker, [['A', 1], ['B', 1]])
    })

    it('should maintain order for nested callbacks', () => {
      const marker = new Array<[string, number]>()
      const S = testScheduler()
      S.asap(
        new Executable(() => {
          marker.push(['A', S.now()])
          S.asap(new Executable(() => marker.push(['B', S.now()])))
        })
      )
      S.asap(new Executable(() => marker.push(['C', S.now()])))
      S.run()
      assert.deepStrictEqual(marker, [['A', 1], ['C', 1], ['B', 1]])
    })

    it('should flush everything before the next tick', () => {
      const marker = new Array<string>()
      const S = testScheduler()
      S.asap(
        new Executable(() => {
          marker.push('A' + S.now())
          S.asap(
            new Executable(() => {
              marker.push('B' + S.now())
              S.asap(
                new Executable(() => {
                  marker.push('C' + S.now())
                  S.asap(
                    new Executable(() => {
                      marker.push('D' + S.now())
                    })
                  )
                })
              )
            })
          )
        })
      )
      S.run()
      assert.deepStrictEqual(marker, ['A1', 'B1', 'C1', 'D1'])
    })

    it('should schedule for current tick', () => {
      const marker = new Array<string>()
      const S = testScheduler()
      S.runTo(100)
      assert.strictEqual(S.now(), 100)

      // scheduled for 101
      S.asap(new Executable(() => marker.push('A' + S.now())))

      S.run()
      assert.deepStrictEqual(marker, ['A101'])
    })
  })

  describe('delay()', () => {
    it('should run on timeout', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.delay(new Executable(() => marker.push(S.now())), 5000)
      S.run()
      assert.strictEqual(S.now(), 5000)
      assert.deepStrictEqual(marker, [5000])
    })

    it('should cancel', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.delay(new Executable(() => marker.push(S.now())), 1000).cancel()
      S.run()
      assert.strictEqual(S.now(), 0)
      assert.deepStrictEqual(marker, [])
    })

    it('should not schedule for passed time', () => {
      const marker: number[] = []
      const S = testScheduler()
      S.delay(new Executable(() => marker.push(S.now())), -100).cancel()
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
      S.asap(new Executable(() => void 0))
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
      S.delay(
        new Executable(() => assert.doesNotThrow(() => S.run(), BailoutError)),
        10
      )
      S.run()
    })

    it('should throw on running multiple times', () => {
      const S = testScheduler()
      S.delay(
        new Executable(() => assert.throws(() => S.run(), ForbiddenNestedRun)),
        10
      )
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
