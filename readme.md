# About

`DynaQueueHandler` is a Queue Job handler for node.js services. It uses the disk (via `dyna-disk-memory`) to save the queue.

`DynaQueueHandler`is **universal**! While the `dyna-disk-memory` is universal you use it on any browser with the limitation of browser's `localStorage`. _Currently the lower is 15mb._

`DynaQueueHandler` is **simple**. It consistent only from two methods, `addJob` and `pickJob`. Instead of use of the `pickJob` method you can listen to on `job` event and pick the job whenever is possible. That's all!

What it supports

- intensive calls of `addJob`
- promises everywhere
- fast disk indexing (for node.js)
- no database dependency
- no memory consumption
- one job per time logic

It is written in Typescript but can be used from plain Javascript as well.

# Installation

`npm run --save dyna-queue-handler`

# Usage
## Example with on `job` event  
```
import {DynaQueueHandler} from 'dyna-queue-handler';

const queue = new DynaQueueHandler({diskPath: './serverQueueFiles'});

queue.on('job', (job: IJob, done: Function) => {
  console.log('picked job data', job.data);
  done();
});

queue.addJob({command: 'getCustomerProfile'});

// it consoles -> picked job data {command: "getCustomerProfile"}
```
## Example with `pickJob` method
```
import {DynaQueueHandler} from 'dyna-queue-handler';

const queue = new DynaQueueHandler({diskPath: './serverQueueFiles'});

async function runForPlay(){
 await queue.addJob({command: 'getCustomerProfile'});
 const job = await queue.pickJob();
 return job.data;
}

runForPlay()
  .then(results => {
    console.log('run results', results);
  });

// it consoles -> run results {command: "getCustomerProfile"}
```
# Basic use

## constructor 

The constructor accepts object with the ISettings interface.

The only needed property is the `diskPath` where can be relative or root based.

**Note!** Only one instance of `DynaQueueHandler` is allowed to use the same disk path.

Example:
```
const queue = new DynaQueueHandler({diskPath: './serverQueueFiles'});
```

## Methods

###  public addJob(data: any, priority: number = 1): Promise<IJob>

Adds a job. Priority is optional. 

`priority` is optional. Default value is 1. Smaller numbers have priority.

Returns the `job`, note that when you have listener for the `job` event, the returned job might already consumed by the event.

### pickJob(priority: number = undefined): Promise<IJob>

You can use this method to pick a job on demand.

> Is recommended to use the event `job` instead of this method. 

You can define explicitly the priority of the job you want to pick. If you don't define the higher priority (the lower value of the priority number) will be used.

If there is no job you will get undefined as resolve of the Promise.

### viewJobs(): Promise<IGroupJobsView>

Returns Promise with the stats of the current jobs.

See at interfaces later in this text what it returns.

## Events

### job

Register listener like this

```
queue.on('job', (job: IJob, done: Function) => {
  console.log('picked job data', job.data);
  done(); // <-- important, you have to call to proceed to next job!
});

```

# Advanced use

The advanced use of methods is that are using the groups, nothing more.

Every job you add (or pick) belongs to a group, by this way you have multiple and simultaneous job queues. Even when you don't use groups, your jobs are saved in the `__defaultGroup` group. 

This is useful when you want to have multiple priorities. Instead to create multiple `DynaQueueHandler`s with different diskPaths, you can use the groups. 

All the methods of the `DynaQueueHandler` support the group argument, even the events.

In this section the full signature of the methods is shown.

## Methods
  
### public addJob(data: any, priority: number = 1, group: string = '__defaultGroup'): Promise<IJob>

The last argument is the group (string). Define the group you want to a add the job. 

### pickJob(priority: number = undefined, group: string = '__defaultGroup'): Promise<IJob>

Pick a job from specific group.

### viewJobs(): Promise<IGroupJobsView>

Returns Promise with the stats of the current jobs.

See at interfaces lower what it returns.

## Events

### job/<group>

> The name of the event should have prefix the text `job/<group>`.

To listen jobs for events from a specific group, for instance `group: 'authentication'`, register listener like this

```
queue.on('job/authentication', (job: IJob, done: Function) => {
  console.log('picked job data', job.data);
  done(); // <-- important, you have to call to proceed to next job!
});
```

# Interfaces

If you use Typescript you can obtain the benefits of the interfaces where this library uses.

## ISettings
Used by the constructor only 
```
{
  diskPath: string;  // where the queue data will be saved.
}
```
## export interface IJob 
```
{
     data: any;             // the data of the job
     arrived: Date;         // when the job initially arrived
     priority: Number;      // the defined priority
     group: string;         // if you use groups (see advanced mode), this the group name 
     id: string;            // internal id, you cannot do something with this really, is internal
     nextJobId: string;     // for internal use, you can't use it
}
```
## IGroupJobsView
Stats for a group.
```
{
     items: Array<{          // the items per priority
          priority: number;  // the priority of these jobs
          count: number;     // how many jobs are pending (exluding this one in process) 
          nextJobId: string; // next job will be processed, you can't use it
          lastJobId: string; // last job added, you can't use it
     }>;
     hasJobs: boolean;       // if in general there are jobs in this group
}
```
