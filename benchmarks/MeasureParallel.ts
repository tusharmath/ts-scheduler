/**
 * Created by tushar on 2019-03-20
 */

import * as BM from 'benchmark'
import {BMDeferred} from './internals/BMDeferred'
import {CreateParallelJob} from './internals/CreateParallelJobs'
import {L, O, S} from './internals/Options'

new BM.Suite('Parallel')
  .add('parallel', (d: BMDeferred) => CreateParallelJob(S, 10000, d), O)
  .on('cycle', L)
  .run()
