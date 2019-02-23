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

  queue.isNotWorking()
    .then(() => consol.log('Nothing in the queue'));    // you may shut down safely

```

# Change log

# 4.0.0

Stable version

# 5.0.0

The `onJob` is now Promise instead of using the `done()` callback.