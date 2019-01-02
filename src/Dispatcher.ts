import {Cancel} from './Cancel'

export type Dispatcher = {
  continue(): boolean
  dispatch(cb: () => void): Cancel
}
