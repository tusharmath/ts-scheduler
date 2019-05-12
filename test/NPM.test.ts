/**
 * Created by tushar on 2019-03-31
 */
import {assert} from 'chai'
import {scheduler} from '../index'
import {Executable} from '../src/internals/Executable'

describe('NPM', () => {
  const delay = () => new Promise<void>(res => setTimeout(res, 100))
  context('asap', () => {
    it('should work in node', async () => {
      let counter = 0
      scheduler.asap(new Executable(() => counter++))
      await delay()

      const actual = counter
      const expected = 1
      assert.strictEqual(actual, expected)
    })
  })

  context('delay', () => {
    it('should work in node', async () => {
      let counter = 0
      scheduler.delay(new Executable(() => counter++), 50)
      await delay()

      const actual = counter
      const expected = 1
      assert.strictEqual(actual, expected)
    })
  })
})
