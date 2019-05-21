/**
 * Created by tushar on 2019-03-20
 */

import * as BM from 'benchmark'
import {BMDeferred} from './internals/BMDeferred'
import {CreateNestedAsapJob} from './internals/CreateNestedAsapJob'
import {L, O, S} from './internals/Options'

new BM.Suite('Asap')
  .add('asap', (d: BMDeferred) => CreateNestedAsapJob(S, 10000, d), O)
  .on('cycle', L)
  .run()
