import {LinkedListNode} from 'dbl-linked-list-ds'
import {Job} from './Job'
import {OnError} from './OnError'

/**
 * A simple job scheduler API. You can only add/remove jobs
 */
export interface IScheduler {
  add(job: Job, onError: OnError): LinkedListNode<[Job, OnError]>
  remove(id: LinkedListNode<[Job, OnError]>): void
}
