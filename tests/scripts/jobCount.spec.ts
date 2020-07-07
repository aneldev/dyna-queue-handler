import "jest";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import {count} from "dyna-count";
import {DynaDiskMemory} from "dyna-disk-memory/dist/commonJs/node";

import {DynaQueueHandler} from "../../src";
import {delay} from "../../src/utils/delay";

describe('Dyna Queue Handler, jobCount', () => {
  it('should have the proper jobCount value', (done) => {
    const COUNT = 100;
    const DELAY = 5;
    const memory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-fast-entry-test',
    });
    const queue = new DynaQueueHandler({
      autoStart: false,
      parallels: 2,
      onJob: async (jobData: any) => {
        jobData; // Just for TS
        await delay(DELAY);
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
    });

    Promise.resolve()
      .then(() => Promise.all(
        count(COUNT)
          .map(serial => queue.addJob(serial))
      ))
      .then(() => expect(queue.jobsCount).toBe(COUNT))
      .then(() => queue.start())
      .then(() => queue.processingJobsCount === 2)
      .then(() => queue.processingJobsCount === 2)
      .then(() => queue.allDone())
      .then(() => expect(queue.jobsCount).toBe(0))
      .catch(fail)
      .then(done);
  });
});
