# ts-scheduler

[![Build Status](https://travis-ci.com/tusharmath/ts-scheduler.svg?branch=master)](https://travis-ci.com/tusharmath/ts-scheduler)
![npm](https://img.shields.io/npm/v/ts-scheduler.svg)

A job scheduler for node and browser environment

# Index

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](https://tusharmath.com/ts-scheduler)

# Installation

**npm:**

```bash
npm i ts-scheduler --save
```

**yarn:**

```bash
yarn add ts-scheduler
```

# Usage

```ts
import {scheduler} from 'ts-scheduler'

const cancellable = scheduler.asap(new Executable(() => console.log('Hi')))

cancellable.cancel() // immediately aborts and doesn't print any thing
```
