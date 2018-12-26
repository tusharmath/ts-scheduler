import {Cancel} from './Cancel'

export interface IDispatcher {
  continue(): boolean
  dispatch(cb: () => void): Cancel
}
