/**
 * Created by tushar on 2019-05-12
 */
import {IJob} from './IJob'

export class Job implements IJob {
  constructor(public readonly execute: () => void) {}
}
