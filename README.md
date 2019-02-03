# ts-scheduler

[![Build Status](https://travis-ci.com/tusharmath/ts-scheduler.svg?branch=master)](https://travis-ci.com/tusharmath/ts-scheduler)
![npm](https://img.shields.io/npm/v/ts-scheduler.svg)
![npm (scoped)](https://img.shields.io/npm/v/ts-scheduler.svg)

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

schedule.asap(() => console.log('Hi')) // prints "Hi" immediately
```

**Usage with Cancellation:**

```ts
import {scheduler} from 'ts-scheduler'

const cancel = schedule.asap(() => console.log('Hi'))

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
const cancel = schedule.asap(job)
```

Takes in a [Job](#job) that can be scheduled to be called later. It returns a [cancel](#cancel) to abort it from being executed.

## delay(cb, duration)

```ts
import {scheduler} from 'ts-scheduler'

const job = () => console.log('Hi')
const cancel = schedule.delay(job, 500)
```

Takes in a function and a duration and calls that function once that duration has elapsed.

## Cancel

```ts
() => void
```

A function that returns void.

# Test API

The scheduler comes in with a built-in [TestScheduler]. This helps in writing better tests for modules that are based on this library.

[testscheduler]: https://github.com/tusharmath/ts-scheduler/blob/master/src/TestScheduler.ts
