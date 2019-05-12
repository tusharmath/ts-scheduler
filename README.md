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

scheduler.asap(new Executable(() => console.log('Hi'))) // prints "Hi" immediately
```

**Usage with Cancellation:**

```ts
import {scheduler} from 'ts-scheduler'

const cancellable = scheduler.asap(new Executable(() => console.log('Hi')))

cancellable.cancel() // immediately aborts and doesn't print any thing
```

# API

## Cancellable

```ts
type Cancellable = {
  cancel(): void
}
```

`Executable` is what you would want to schedule through this library. Its just an object that contains an execute function that returns a `void`.

## asap(cb)

```ts
import {scheduler, Executable} from 'ts-scheduler'

const executable = new Executable(() => console.log('Hi'))
const cancel = scheduler.asap(executable)
```

Takes in a [Executable](#executable) that can be scheduled to be called later. It returns a [Cancellable](#cancellable) to abort it from being executed.

## delay(executable, duration)

```ts
import {scheduler, Executable} from 'ts-scheduler'

const executable = new Executable(() => console.log('Hi'))
const cancellable = scheduler.delay(executable, 500)
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

The scheduler comes in with a built-in [TestScheduler]. This helps in writing better tests for modules that are based on this library. Internally it maintains a "queue" of executables and keeps checking if its time to execute those executables in an highly efficient manner.

**Example:**

```ts
import {testScheduler, Executable} from 'ts-scheduler/test'

const scheduler = testScheduler()

const executable = new Executable(() => console.log('Hi'))

// will not print anything until run() is called
scheduler.asap(executable)

// automatically runs all the executables that have been scheduled.
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

Whenever `asap` or `delay` is used to schedule an [Executable](#executable) its put inside an internal "queue". On calling `run()` all the executables are executed until the queue becomes empty.

```ts
const executable0 = new Executable(() => console.log('Hi'))
const executable1 = new Executable(() => console.log('Bye'))

// executable is put into its internal queue
scheduler.delay(executable0, 1000)

// executable1 is put in front of the executable0
scheduler.delay(executable1, 300)

// Runs the executables in the correct order
scheduler.run()

// logs: Bye
// logs: Hi
```

[testscheduler]: https://github.com/tusharmath/ts-scheduler/blob/master/src/TestScheduler.ts
