import {assert} from 'chai'
import {scheduler} from '../index'
import {IFnArg} from '../src/internals/IFnArgs'
import {Ticker} from '../src/internals/Ticker'
import {Scheduler} from '../src/main/Scheduler'

describe('Scheduler', () => {
  const CreateScheduler = () => {
    const Q = new Array<IFnArg<unknown[]>>()

    const ticker: Ticker = <T extends unknown[]>(
      fn: (...t: T) => void,
      ...args: T
    ) => Q.push({fn, args})

    return {
      flush: () => {
        while (Q.length > 0) {
          const elm = Q.shift()
          if (elm) {
            elm.fn(...elm.args)
          }
        }
      },
      sh: new Scheduler(ticker)
    }
  }
  describe('asap', () => {
    it('should execute a job', cb => {
      const {sh, flush} = CreateScheduler()
      sh.asap(cb)
      flush()
    })

    it('should wait and then execute', () => {
      const {sh, flush} = CreateScheduler()
      let i = 0
      sh.asap(() => i++)
      flush()
      assert.equal(i, 1)
    })

    it('should not execute a job when removed', () => {
      const {sh, flush} = CreateScheduler()

      let i = 0
      sh.asap(() => i++).cancel()

      flush()

      assert.strictEqual(i, 0)
    })

    it('should execute all the jobs', async () => {
      const {sh, flush} = CreateScheduler()

      let i = 10
      const INC = () => i++
      const DBL = () => (i = i * 2)
      sh.asap(INC)
      sh.asap(DBL)

      flush()

      assert.strictEqual(i, 22)
    })

    it('should run the jobs in order', async () => {
      const {sh, flush} = CreateScheduler()

      const R: number[] = []
      sh.asap(() => R.push(0))
      sh.asap(() => R.push(1))
      sh.asap(() => R.push(2))

      flush()
      assert.deepStrictEqual(R, [0, 1, 2])
    })

    it('should run nested jobs in order', async () => {
      const {sh, flush} = CreateScheduler()

      const R: string[] = []
      sh.asap(() => {
        R.push('A')
        sh.asap(() => R.push('C'))
      })
      sh.asap(() => R.push('B'))

      flush()
      assert.deepStrictEqual(R, ['A', 'B', 'C'])
    })

    it('should call fn with args', async () => {
      const {sh, flush} = CreateScheduler()

      const R: number[] = []
      sh.asap((a, b, c) => R.push(a + b + c), 1, 2, 3)
      flush()
      assert.deepStrictEqual(R, [6])
    })
  })

  describe('delay()', () => {
    it('should call cb after the given duration', cb => {
      const duration = 150
      const start = Date.now()
      scheduler.delay(() => {
        const diff = Date.now() - start
        assert.ok(diff >= duration, `Expected:${duration}\nActual: ${diff}`)
        cb()
      }, duration)
    })

    it('should be cancellable', cb => {
      scheduler.delay(() => cb('Delay was not not cancelled'), 0).cancel()
      cb()
    })

    it('should call fn with args', cb => {
      scheduler.delay(
        (...t) => {
          assert.deepStrictEqual(t, [1, 2, 3])
          cb()
        },
        10,
        1,
        2,
        3
      )
    })
  })
})
