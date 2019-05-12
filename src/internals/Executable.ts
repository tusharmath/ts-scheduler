/**
 * Created by tushar on 2019-05-12
 */
import {IExecutable} from './IExecutable'

export class Executable implements IExecutable {
  constructor(public readonly execute: () => void) {}
}
