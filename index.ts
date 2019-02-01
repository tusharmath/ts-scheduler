/* tslint:disable:file-name-casing */

import {AsapScheduler} from './src/AsapScheduler'
import {IScheduler} from './src/IScheduler'

export const asap: IScheduler<unknown> = new AsapScheduler()
