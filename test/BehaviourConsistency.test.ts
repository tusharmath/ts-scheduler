/**
 * Created by tushar on 2019-03-26
 */
import * as assert from 'assert'
import {IScheduler} from '../src/IScheduler'
import {Scheduler} from '../src/Scheduler'
import {TestScheduler} from '../src/TestScheduler'

describe('Behaviour Consistency', () => {
  const delay = (duration: number) => {
    return new Promise(resolve => setTimeout(resolve, duration))
  }

  const insertNestedJobs = (scheduler: IScheduler) => {
    const marker = new Array<string>()
    scheduler.asap(() => {
      marker.push('A')
      scheduler.asap(() => {
        marker.push('B')
        scheduler.asap(() => {
          marker.push('C')
          scheduler.asap(() => {
            marker.push('D')
          })
        })
      })
    })
    return marker
  }

  const insertParallelJobs = (scheduler: IScheduler) => {
    const marker = new Array<string>()
    scheduler.asap(() => marker.push('A'))
    scheduler.asap(() => marker.push('B'))
    scheduler.asap(() => marker.push('C'))
    scheduler.asap(() => marker.push('D'))
    return marker
  }

  context('nested jobs', () => {
    it('should mimic Scheduler', async () => {
      const S = new Scheduler(cb => process.nextTick(cb))
      const T = new TestScheduler()
      const systemMarker = insertNestedJobs(S)
      const testMarker = insertNestedJobs(T)
      T.run() // Manually run the test scheduler

      await delay(10) // Random delay to ensure everything is complete

      assert.deepStrictEqual(systemMarker, testMarker)
    })
  })

  context('parallel jobs', () => {
    it('should mimic Scheduler', async () => {
      const S = new Scheduler(cb => process.nextTick(cb))
      const T = new TestScheduler()
      const systemMarker = insertParallelJobs(S)
      const testMarker = insertParallelJobs(T)
      T.run() // Manually run the test scheduler

      await delay(10) // Random delay to ensure everything is complete

      assert.deepStrictEqual(systemMarker, testMarker)
    })
  })
})
