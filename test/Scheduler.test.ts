import * as assert from 'assert'
import {scheduler} from '..'
import {Scheduler} from '../src/Scheduler'

describe('Scheduler', () => {
  const NEXT = () => Promise.resolve()
  describe('asap', () => {
    it('should execute a job', cb => {
      scheduler.asap(cb)
    })

    it('should wait and then execute', async () => {
      let i = 0
      scheduler.asap(() => i++)
      await NEXT()
      assert.equal(i, 1)
    })

    it('should not execute a job when removed', () => {
      let i = 0
      scheduler.asap(() => i++)()
      assert.equal(i, 0)
    })

    it('should execute all the jobs', async () => {
      let i = 10
      const INC = () => i++
      const DBL = () => (i = i * 2)
      scheduler.asap(INC)
      scheduler.asap(DBL)

      await NEXT()
      assert.equal(i, 22)
    })

    it('should run the jobs in order', async () => {
      const R: number[] = []
      scheduler.asap(() => R.push(0))
      scheduler.asap(() => R.push(1))
      scheduler.asap(() => R.push(2))

      await NEXT()
      assert.deepStrictEqual(R, [0, 1, 2])
    })

    it('should run nested jobs in order', async () => {
      const R: string[] = []

      scheduler.asap(() => {
        R.push('A')

        scheduler.asap(() => R.push('C'))
      })

      scheduler.asap(() => R.push('B'))

      await NEXT()
      assert.deepStrictEqual(R, ['A', 'B', 'C'])
    })
  })

  describe('delay()', () => {
    it('should call cb after the given duration', cb => {
      const duration = 150
      const start = Date.now()
      const S = new Scheduler()
      S.delay(() => {
        const diff = Date.now() - start
        assert.ok(diff >= duration, `Expected:${duration}\nActual: ${diff}`)
        cb()
      }, duration)
    })

    it('should be cancellable', cb => {
      const S = new Scheduler()
      S.delay(() => cb('Delay was not not cancelled'), 0)()
      cb()
    })
  })
})
