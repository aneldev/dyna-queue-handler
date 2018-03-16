import {DynaQueueHandler} from "../src";

const queue: DynaQueueHandler = new DynaQueueHandler({
  diskPath: './temp/queueDisk'
});

async function runForPlay(){
 await queue.addJob({command: 'getCustomerProfile'});
 const job = await queue.pickJob();
 return job.data;
}

runForPlay()
  .then(results => {
    console.log('run results', results);
  });

