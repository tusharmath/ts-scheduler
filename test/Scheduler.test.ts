import * as assert from 'assert'
import {asap} from '..'

describe('Scheduler', () => {
  const NEXT = () => Promise.resolve()
  describe('asap', () => {
    it('should execute a job', cb => {
      asap.asap(cb)
    })

    it('should wait and then execute', async () => {
      let i = 0
      asap.asap(() => i++)
      await NEXT()
      assert.equal(i, 1)
    })

    it('should not execute a job when removed', () => {
      let i = 0
      asap.asap(() => i++)()
      assert.equal(i, 0)
    })

    it('should execute all the jobs', async () => {
      let i = 10
      const INC = () => i++
      const DBL = () => (i = i * 2)
      asap.asap(INC)
      asap.asap(DBL)

      await NEXT()
      assert.equal(i, 22)
    })

    it('should run the jobs in order', async () => {
      const R: number[] = []
      asap.asap(() => R.push(0))
      asap.asap(() => R.push(1))
      asap.asap(() => R.push(2))

      await NEXT()
      assert.deepStrictEqual(R, [0, 1, 2])
    })

    it('should run nested jobs in order', async () => {
      const R: string[] = []

      asap.asap(() => {
        R.push('A')

        asap.asap(() => R.push('C'))
      })

      asap.asap(() => R.push('B'))

      await NEXT()
      assert.deepStrictEqual(R, ['A', 'B', 'C'])
    })
  })
})
