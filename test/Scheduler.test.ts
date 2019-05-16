import {assert} from 'chai'
import {scheduler} from '../index'
import {Executable} from '../src/internals/Executable'
import {Ticker} from '../src/internals/Ticker'
import {Scheduler} from '../src/main/Scheduler'

describe('Scheduler', () => {
  const CreateScheduler = <A>() => {
    let runner: (ctx: Scheduler) => void | undefined
    let context: Scheduler

    const ticker: Ticker<Scheduler> = (
      cb: (ctx: Scheduler) => void,
      ctx: Scheduler
    ) => {
      runner = cb
      context = ctx
    }
    return {sh: new Scheduler(ticker), flush: () => runner(context)}
  }
  describe('asap', () => {
    it('should execute a job', cb => {
      const {sh, flush} = CreateScheduler()
      sh.asap(new Executable(cb))
      flush()
    })

    it('should wait and then execute', () => {
      const {sh, flush} = CreateScheduler()
      let i = 0
      sh.asap(new Executable(() => i++))
      flush()
      assert.equal(i, 1)
    })

    it('should not execute a job when removed', () => {
      const {sh, flush} = CreateScheduler()

      let i = 0
      sh.asap(new Executable(() => i++)).cancel()

      flush()

      assert.strictEqual(i, 0)
    })

    it('should execute all the jobs', async () => {
      const {sh, flush} = CreateScheduler()

      let i = 10
      const INC = () => i++
      const DBL = () => (i = i * 2)
      sh.asap(new Executable(INC))
      sh.asap(new Executable(DBL))

      flush()

      assert.strictEqual(i, 22)
    })

    it('should run the jobs in order', async () => {
      const {sh, flush} = CreateScheduler()

      const R: number[] = []
      sh.asap(new Executable(() => R.push(0)))
      sh.asap(new Executable(() => R.push(1)))
      sh.asap(new Executable(() => R.push(2)))

      flush()
      assert.deepStrictEqual(R, [0, 1, 2])
    })

    it('should run nested jobs in order', async () => {
      const {sh, flush} = CreateScheduler()

      const R: string[] = []
      sh.asap(
        new Executable(() => {
          R.push('A')
          sh.asap(new Executable(() => R.push('C')))
        })
      )
      sh.asap(new Executable(() => R.push('B')))

      flush()
      assert.deepStrictEqual(R, ['A', 'B', 'C'])
    })
  })

  describe('delay()', () => {
    it('should call cb after the given duration', cb => {
      const duration = 150
      const start = Date.now()
      scheduler.delay(
        new Executable(() => {
          const diff = Date.now() - start
          assert.ok(diff >= duration, `Expected:${duration}\nActual: ${diff}`)
          cb()
        }),
        duration
      )
    })

    it('should be cancellable', cb => {
      scheduler
        .delay(new Executable(() => cb('Delay was not not cancelled')), 0)
        .cancel()
      cb()
    })
  })
})
