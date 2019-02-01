import * as assert from 'assert'
import {asap} from '../'

describe('AsapScheduler', () => {
  const NEXT = () => Promise.resolve()
  it('should execute a job', cb => {
    asap.add(cb, cb)
  })

  it('should wait and then execute', async () => {
    let i = 0
    asap.add(() => i++, assert.fail)
    await NEXT()
    assert.equal(i, 1)
  })

  it('should not execute a job when removed', () => {
    let i = 0
    const id = asap.add(() => i++, assert.fail)
    asap.remove(id)
    assert.equal(i, 0)
  })

  it('should execute all the jobs', async () => {
    let i = 10
    const INC = () => i++
    const DBL = () => (i = i * 2)
    asap.add(INC, assert.fail)
    asap.add(DBL, assert.fail)

    await NEXT()
    assert.equal(i, 22)
  })

  it('should call onError', async () => {
    let message
    const THROWER = () => {
      throw new Error('TEST_FAILURE')
    }
    const CATCHER = (e: Error) => {
      message = e.message
    }
    asap.add(THROWER, CATCHER)

    await NEXT()
    assert.equal(message, 'TEST_FAILURE')
  })

  it('should run the jobs in order', async () => {
    const R: number[] = []
    asap.add(() => R.push(0), assert.fail)
    asap.add(() => R.push(1), assert.fail)
    asap.add(() => R.push(2), assert.fail)

    await NEXT()
    assert.deepStrictEqual(R, [0, 1, 2])
  })

  it('should run nested jobs in order', async () => {
    const R: string[] = []

    asap.add(() => {
      R.push('A')

      asap.add(() => R.push('C'), assert.fail)
    }, assert.fail)

    asap.add(() => R.push('B'), assert.fail)

    await NEXT()
    assert.deepStrictEqual(R, ['A', 'B', 'C'])
  })
})
