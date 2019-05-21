/**
 * Created by tushar on 2019-05-21
 */

import * as BM from 'benchmark'
import {BMDeferred} from './internals/BMDeferred'
import {CreateAndCancelJob} from './internals/CreateAndCancel'
import {L, O, S} from './internals/Options'

new BM.Suite('Parallel')
  .add('cancel', (d: BMDeferred) => CreateAndCancelJob(S, 100, d), O)
  .on('cycle', L)
  .run()
