/**
 * Created by tushar on 2019-03-26
 */
import * as assert from 'assert'
import {IScheduler} from '../src/IScheduler'
import {Scheduler} from '../src/Scheduler'
import {TestScheduler} from '../src/TestScheduler'

describe('asap', () => {
  const delay = () => new Promise(resolve => setTimeout(resolve, 20))

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

  const insertRandomJobs = (schedulers: IScheduler[]) => {
    const marker = new Array<[IScheduler, string]>()
    const RandomInt = (max: number) => Math.round(Math.random() * max)
    const RandomBoolean = () => RandomInt(1) === 0

    const JobIDSet = Array.from({length: 26}, (_, i) =>
      String.fromCharCode(i + 65)
    )

    const insertJob = () => {
      const count0 = RandomInt(JobIDSet.length - 1)
      for (let i = 0; i < count0 / 2; i++) {
        insertJob()
      }
      if (JobIDSet.length > 0) {
        const id = JobIDSet.shift() as string
        schedulers.forEach(scheduler =>
          scheduler.asap(() => {
            marker.push([scheduler, id])
            if (RandomBoolean()) {
              insertJob()
            }
          })
        )
      }

      const count1 = RandomInt(JobIDSet.length - 1)
      for (let i = 0; i < count1 / 2; i++) {
        insertJob()
      }
    }

    insertJob()

    return {
      pick: (s: IScheduler) => marker.filter(i => i[0] === s).map(_ => _[1])
    }
  }

  context('nested jobs', () => {
    it('should mimic Scheduler', async () => {
      const S = new Scheduler(cb => process.nextTick(cb))
      const T = new TestScheduler()
      const systemMarker = insertNestedJobs(S)
      const testMarker = insertNestedJobs(T)
      T.run() // Manually run the test scheduler

      await delay() // Random delay to ensure everything is complete

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

      await delay() // Random delay to ensure everything is complete

      assert.deepStrictEqual(systemMarker, testMarker)
    })
  })

  context('random job', () => {
    it('should be consistent', async () => {
      const S = new Scheduler(cb => process.nextTick(cb))
      const T = new TestScheduler()
      const {pick} = insertRandomJobs([S, T])
      T.run()
      await delay()
      const markerS = pick(S)
      const markerT = pick(T)

      console.log({markerT: markerT.join(''), markerS: markerS.join('')})
      assert.deepStrictEqual(markerS, markerT)
    })
  })
})
