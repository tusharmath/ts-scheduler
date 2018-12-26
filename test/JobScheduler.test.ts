import * as assert from 'assert'
import {JobScheduler} from '../src/JobScheduler'
import {TestDispatcher} from '../src/TestDispatcher'

describe('JobScheduler', () => {
  const createScheduler = (): [
    (n: number) => void,
    (t: string) => void,
    Array<[number, string]>,
    JobScheduler
  ] => {
    const result: Array<[number, string]> = []
    const d = new TestDispatcher()
    const s = new JobScheduler(d)
    const QUE = (t: string) => s.enqueue(() => result.push([d.now(), t]))
    const MOV = (n: number) => d.move(n)
    return [MOV, QUE, result, s]
  }

  it('#1 QUE', () => {
    const [M, Q, actual] = createScheduler()

    Q('A')
    Q('B')
    Q('C')

    M(10)
    const expected = [[10, 'A'], [10, 'B'], [10, 'C']]

    assert.deepStrictEqual(actual, expected)
  })

  it('#2 QUE', () => {
    const [MOV, QUE, actual] = createScheduler()

    MOV(5)
    QUE('A')
    MOV(15)

    const expected = [[15, 'A']]

    assert.deepStrictEqual(actual, expected)
  })

  it('#3 QUE', () => {
    const [MOV, QUE, actual] = createScheduler()

    MOV(5)
    QUE('A') // 15
    MOV(10)
    QUE('B') // 15
    MOV(15)
    QUE('C') // 25
    MOV(25)

    const expected = [[15, 'A'], [15, 'B'], [25, 'C']]

    assert.deepStrictEqual(actual, expected)
  })
})
