import {DynaQueueHandler, IJob} from "../src";

const queue: DynaQueueHandler = new DynaQueueHandler({
  diskPath: './temp/queueDisk'
});

queue.on('job', (job: IJob, done: Function) => {
  console.log('picked job data', job.data);
  done();
});

queue.addJob({command: 'getCustomerProfile'});
