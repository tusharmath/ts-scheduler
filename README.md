# ts-scheduler

[![Build Status](https://travis-ci.com/tusharmath/ts-scheduler.svg?branch=master)](https://travis-ci.com/tusharmath/ts-scheduler)
![npm](https://img.shields.io/npm/v/ts-scheduler.svg)

A job scheduler for node and browser environment

# Installation

```bash
npm i ts-scheduler
```

# Example

`scheduler.asap()` is a more efficient way than `setTimeout` or `Promise.resolve`. It allocates less memory and can be synchronously cancelled.

**Simple Usage:**

```ts
import {scheduler} from 'ts-scheduler'

scheduler.asap(() => console.log('Hi')) // prints "Hi" immediately
```

**Usage with Cancellation:**

```ts
import {scheduler} from 'ts-scheduler'

const cancel = scheduler.asap(() => console.log('Hi'))

cancel() // immediately aborts and doesn't print any thing
```

# API

## Job

```ts
() => void
```

`Job` is what you would want to schedule through this library. Its just a function that returns a `void`.

## asap(cb)

```ts
import {scheduler} from 'ts-scheduler'

const job = () => console.log('Hi')
const cancel = scheduler.asap(job)
```

Takes in a [Job](#job) that can be scheduled to be called later. It returns a [cancel](#cancel) to abort it from being executed.

## delay(cb, duration)

```ts
import {scheduler} from 'ts-scheduler'

const job = () => console.log('Hi')
const cancel = scheduler.delay(job, 500)
```

Takes in a function and a duration and calls that function once that duration has elapsed.

## Cancellable

```ts
type Cancellable = {
  cancel(): void
}
```

An interface that contains a method `cancel` that when called releases all resources and returns void.

# Test API

The scheduler comes in with a built-in [TestScheduler]. This helps in writing better tests for modules that are based on this library. Internally it maintains a "queue" of jobs and keeps checking if its time to execute those jobs in an highly efficient manner.

**Example:**

```ts
import {testScheduler} from 'ts-scheduler/test'

const scheduler = testScheduler()

const job = () => console.log('Hi')

// will not print anything until run() is called
scheduler.asap(job)

// automatically runs all the jobs that have been scheduled.
scheduler.run() // prints "Hi"
```

It has all the methods that the main `Scheduler` api has viz — `asap` and `delay` but adds a few helper methods of its own.

## now()

Returns the virtual current time

```ts
import {testScheduler} from 'ts-scheduler/test'

const scheduler = testScheduler()

// prints 0 by default
console.log(scheduler.now())

// Increases the current time by 1
scheduler.tick()

// prints 1
console.log(scheduler.now())
```

## tick()

The [TestScheduler] has a concept of virtual time. It starts with `0` and every time you call the `tick` method the internal time increases by `1`. On each "tick" items from its internal queue are pulled to see if it can be executed.

```ts
import {testScheduler} from 'ts-scheduler/test'

const scheduler = testScheduler()

// prints 0
console.log(scheduler.now())

// Increases the current time by 1
scheduler.tick()

// prints 1
console.log(scheduler.now())
```

## run()

Whenever `asap` or `delay` is used to schedule a [Job](#job) its put inside an internal "queue". On calling `run()` all the jobs are executed until the queue becomes empty.

```ts
const job0 = () => console.log('Hi')
const job1 = () => console.log('Bye')

// job is put into its internal queue
scheduler.delay(job0, 1000)

// job1 is put in front of the job0
scheduler.delay(job1, 300)

// Runs the jobs in the correct order
scheduler.run()

// logs: Bye
// logs: Hi
```

[testscheduler]: https://github.com/tusharmath/ts-scheduler/blob/master/src/TestScheduler.ts
