import "jest";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import {count} from "dyna-count";
import {DynaDiskMemory} from "dyna-disk-memory/dist/commonJs/node";

import {DynaQueueHandler} from "../../src";
import {delay} from "../../src/utils/delay";

describe('Dyna Queue Handler, jobs getter', () => {
  it('should be able to get all current jobs', (done: Function) => {
    const COUNT = 10;
    const DELAY = 5;
    const memory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-fast-entry-test',
    });
    const queue = new DynaQueueHandler({
      onJob: async (jobData: any) => {
        if (jobData === 'completed') {
          done();
          return;
        }
        await delay(DELAY);
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
    });

    Promise.resolve()
      .then(() => queue.init())
      .then(() => Promise.all(
        count(COUNT)
          .map(serial => queue.addJob({ serial }))
      ))
      .then(() => expect(queue.jobsCount).toBe(COUNT))
      .then(() => {
        return queue.jobs
          .then(jobs => expect(jobs).toMatchSnapshot());
      })
      .then(() => queue.addJob('completed'))
      .then(() => queue.isNotWorking())
      .then(() => expect(queue.jobsCount).toBe(0))
      .catch(error => {
        console.error('error', error);
        done();
      });
  });
});