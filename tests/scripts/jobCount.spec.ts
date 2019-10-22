import "jest";
import {DynaDiskMemory} from "dyna-disk-memory/dist/commonJs/node";

import {DynaQueueHandler} from "../../src";
import {delay} from "../../src/utils/delay";

describe('Dyna Queue Handler, jobCount', () => {
  it('should have the proper jobCount value', (done: Function) => {
    const COUNT = 100;
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
        Array(COUNT)
          .fill(null)
          .map((v, index) => index)
          .map(serial => queue.addJob(serial))
      ))
      .then(() => expect(queue.jobsCount).toBe(COUNT))
      .then(() => queue.addJob('completed'))
      .catch(error => {
        console.error('error', error);
        done();
      });
  });

});
