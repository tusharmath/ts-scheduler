import {assert} from 'chai'
import {scheduler} from '../index'
import {Job} from '../src/internals/Job'
import {Scheduler} from '../src/main/Scheduler'

describe('Scheduler', () => {
  const CreateScheduler = () => {
    let run: () => void | undefined
    const cb = (__: () => void) => {
      run = __
    }
    return {sh: new Scheduler(cb), flush: () => run()}
  }
  describe('asap', () => {
    it('should execute a job', cb => {
      const {sh, flush} = CreateScheduler()
      sh.asap(new Job(cb))
      flush()
    })

    it('should wait and then execute', () => {
      const {sh, flush} = CreateScheduler()
      let i = 0
      sh.asap(new Job(() => i++))
      flush()
      assert.equal(i, 1)
    })

    it('should not execute a job when removed', () => {
      const {sh, flush} = CreateScheduler()

      let i = 0
      sh.asap(new Job(() => i++)).cancel()

      flush()

      assert.strictEqual(i, 0)
    })

    it('should execute all the jobs', async () => {
      const {sh, flush} = CreateScheduler()

      let i = 10
      const INC = () => i++
      const DBL = () => (i = i * 2)
      sh.asap(new Job(INC))
      sh.asap(new Job(DBL))

      flush()

      assert.strictEqual(i, 22)
    })

    it('should run the jobs in order', async () => {
      const {sh, flush} = CreateScheduler()

      const R: number[] = []
      sh.asap(new Job(() => R.push(0)))
      sh.asap(new Job(() => R.push(1)))
      sh.asap(new Job(() => R.push(2)))

      flush()
      assert.deepStrictEqual(R, [0, 1, 2])
    })

    it('should run nested jobs in order', async () => {
      const {sh, flush} = CreateScheduler()

      const R: string[] = []
      sh.asap(
        new Job(() => {
          R.push('A')
          sh.asap(new Job(() => R.push('C')))
        })
      )
      sh.asap(new Job(() => R.push('B')))

      flush()
      assert.deepStrictEqual(R, ['A', 'B', 'C'])
    })
  })

  describe('delay()', () => {
    it('should call cb after the given duration', cb => {
      const duration = 150
      const start = Date.now()
      scheduler.delay(
        new Job(() => {
          const diff = Date.now() - start
          assert.ok(diff >= duration, `Expected:${duration}\nActual: ${diff}`)
          cb()
        }),
        duration
      )
    })

    it('should be cancellable', cb => {
      scheduler
        .delay(new Job(() => cb('Delay was not not cancelled')), 0)
        .cancel()
      cb()
    })
  })
})
