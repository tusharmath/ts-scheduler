import {Scheduler} from '../../src/main/Scheduler'

/**
 * Created by tushar on 2019-03-20
 */

export const S = new Scheduler(cb => Promise.resolve().then(cb))
export const O = {defer: true}
export const L = (event: Event) => {
  // tslint:disable-next-line:no-console
  console.log(String(event.target))
}
