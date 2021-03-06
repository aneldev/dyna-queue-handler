﻿# About

`DynaQueueHandler` is a Queue Job handler for node.js services or for web browser applications.

- intensive calls of `addJob`
- promises
- configurable parallels
- uses your memory implementation

It is written in Typescript but can be used from plain Javascript as well.

# Installation

`npm install --save dyna-queue-handler`

# Usage
_Typescript example_

```
  import {DynaQueueHandler} from 'dyna-queue-handler';

  interface IParcel {                                 // out type of data
    serial: string;
  }

  let queue = new DynaQueueHandler({
    diskPath: './temp/my-process-temp-space',         // needed in both nodejs and web
    parallels: 5,                                     // (default 1) how may parallel jobs might be executed at a time
    onJob: async (data: IParcel): Promise<void> => {  // return a promise to continue
      // process the data here
    }
  });

  queue.addJob<IParcel>({serial: "y"}, 200);          // push something with priority 100 (smaller have priority)
  queue.addJob<IParcel>({serial: "z"}, 2000);         // push something no so urgent

  queue.allDone()
    .then(() => consol.log('Nothing in the queue and is not working'));    // you may shut down safely

```

# Configuration

```
interface IDynaQueueHandlerConfig<TData> {
  parallels?: number;       // default: 1
  autoStart?: boolean;      // default: true

  // Handler to process a job
  onJob: (data: TData) => Promise<void>;

  // Handler to read and write data to a storage of your choice
  memorySet: (key: string, data: any) => Promise<void>;
  memoryGet: (key: string) => Promise<any>;
  memoryDel: (key: string) => Promise<void>;
  memoryDelAll: () => Promise<void>;
}
```

# Methods

## start(): void

Start running jobs. The default configuration has the `autoStart: true` so is not required to call it.

## stop(): void

Will stop running jobs.

## addJob<TData>(data?: TData, priority: number = 1): Promise<void>

Add a job providing data for this job and optionally priority.

Smaller priorities will be processed first.

## allDone(): Promise<void>

A promise that it is resolved when all jobs have been processed.

## get jobs(): Promise<any[]>

A promised getter to get all pending jobs (excluding the current).

Example: 

```
  const pendingJobs = await queue.jobs;
```
## get hasJobs(): boolean

Returns true if it has pending or running jobs.

```
  const hasPendingJobs = await queue.hasJobs;
```

## get jobsCount(): number

Returns the number of pending and running jobs.

## get processingJobsCount(): number

Returns the number of jobs that are currently processed. This number is less or equal to the `parallels` of the configuration.

# Change log

# 4.0.0

Stable version

# 5.0.0

The `onJob` is now Promise instead of using the `done()` callback.

# 6.0.0

You have to provide storage methods in the configuration `memorySet/Get/Del/DelAll`.

You can use the [dyna-disk-memory](https://github.com/aneldev/dyna-disk-memory) where it has an implementation for `nodeJS` using physical disk, or `web browser` where is uses the `localstorage`.

OR you can implement your storage implementing the `memorySet/Get/Del/DelAll`.

# 6.1.0

New properties

- start(): void
- stop(): void
- get jobs(): Promise<any[]>
- get processingJobsCount(): number

# 7.0.0

- Better performance
- No `init()` is needed anymore
- The delete operations done in background
- The `isNotWorking` is renamed to `allDone`

