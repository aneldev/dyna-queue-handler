# DynaQueueHandler - A Utility Library for Managing Queued Jobs

The `DynaQueueHandler` class is a powerful utility library designed to help you manage queued jobs efficiently. It allows you to control the parallel execution of asynchronous tasks, making it ideal for scenarios where you need to manage concurrency and ensure job execution order.

**DynaQueueHandler is a robust and widely used library in production non-public projects. It is written in TypeScript and serves as a handler for processing heavy data loads in both Node.js and web applications.**

## Installation

To use `DynaQueueHandler` in your node.js or web project, you can install it via npm:

```bash
npm install dyna-queue-handler
```

## Usage

### Importing the Library

```javascript
import { DynaQueueHandler } from "dyna-queue-handler";
```

### Creating an Instance

To create an instance of `DynaQueueHandler`, you need to provide a configuration object that defines the behavior of the queue handler. Here's an example of how to create an instance:

```javascript
const queueHandler = new DynaQueueHandler({
  parallels: 3, // Number of parallel jobs to execute (optional, defaults to 1)
  autoStart: true, // Whether to start processing jobs automatically (optional, defaults to true)
  onJob: async (data) => {
    // The function to execute for each job
    // You can define your job processing logic here
  },
  memorySet: async (key, data) => {
    // Function to store data in memory
  },
  memoryGet: async (key) => {
    // Function to retrieve data from memory
  },
  memoryDel: async (key) => {
    // Function to delete data from memory
  },
  memoryDelAll: async () => {
    // Function to delete all data from memory
  },
});
```

The "memory" callbacks provide you with the freedom to choose the type of memory storage you want to use. With these callbacks, you can use anything from simple memory to a database. The choice is yours.

### Starting and Stopping the Queue

You can start and stop the queue handler using the following methods:

```javascript
queueHandler.start(); // Start processing jobs
queueHandler.stop();  // Stop processing jobs
```

### Adding Jobs to the Queue

To add a job to the queue, use the `addJob` method. You can specify the data for the job and an optional priority level:

```javascript
await queueHandler.addJob({/* your job data */}, /* priority */);
```

### Monitoring Queue Status

You can monitor the status of the queue using the following properties and methods:

- `queueHandler.isWorking`: Returns `true` if there are active jobs being processed.
- `queueHandler.hasJobs`: Returns `true` if there are pending jobs in the queue.
- `queueHandler.jobsCount`: Returns the total number of jobs (including processing).
- `queueHandler.processingJobsCount`: Returns the number of currently processing jobs.
- `queueHandler.allDone()`: Returns a promise that resolves when all jobs are completed.

## Example

Here's a simple example of how to use `DynaQueueHandler`:

```typescript
import { DynaQueueHandler } from "dyna-queue-handler";

// Define the IPerson interface
interface IPerson {
  displayName: string;
  start: number;
}

// Create a DynaQueueHandler instance with configuration
const queueHandler = new DynaQueueHandler<IPerson>({
  parallels: 2,
  onJob: async (data) => {
    console.log(`Processing job for ${data.displayName} (started at ${data.start})`);
    // Simulate job execution
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  },
  memorySet: async (key, data) => {
    // Implement your memory set logic here
    // For example, using an in-memory object:
    memoryStorage[key] = data;
  },
  memoryGet: async (key) => {
    // Implement your memory get logic here
    // For example, using an in-memory object:
    return memoryStorage[key];
  },
  memoryDel: async (key) => {
    // Implement your memory delete logic here
    // For example, using an in-memory object:
    delete memoryStorage[key];
  },
  memoryDelAll: async () => {
    // Implement your memory delete all logic here
    // For example, using an in-memory object:
    memoryStorage = {};
  },
});

// Start processing jobs
queueHandler.start();

// In-memory storage (replace with your preferred storage mechanism)
let memoryStorage: { [key: string]: IPerson } = {};

// Add jobs to the queue
await queueHandler.addJob<IPerson>({ displayName: "Person 1", start: Date.now() });
await queueHandler.addJob<IPerson>({ displayName: "Person 2", start: Date.now() });
await queueHandler.addJob<IPerson>({ displayName: "Person 3", start: Date.now() });

// Wait for all jobs to complete
await queueHandler.allDone();

// Stop the queue
queueHandler.stop();
```

