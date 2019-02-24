import {DynaDiskMemory} from "dyna-disk-memory/dist/commonJs/node";

import {DynaQueueHandler} from "../../src";
import {delay} from "../../src/utils/delay";

declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

interface IParcel {
  serial: number;
}

describe('Dyna Queue Handler priority test', () => {
  const PROCESS_DELAY: number = 100;
  const processed: IParcel[] = [];
  let memory = new DynaDiskMemory({
    diskPath: './temp/testDynaQueueHandler-priority-test',
  });
  let queue: DynaQueueHandler;

  it('should create the queue', (done: Function) => {
    queue = new DynaQueueHandler({
      onJob: async (data: IParcel) => {
        processed.push(data);
        await delay(PROCESS_DELAY);
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
    });
    queue.init()
      .then(() => done());
  });

  it('should add 10 jobs with priority 2oo', (done: () => void) => {
    Promise.all(
      Array(10).fill(null)
        .map((v, index) => queue.addJob<IParcel>({serial: index}, 200))
    )
      .then(() => done());
  });

  it('should add 2 jobs with priority 1o', (done: () => void) => {
    Promise.all(
      Array(2).fill(null)
        .map((v, index) => {
          const serial: number = index + 100;
          queue.addJob<IParcel>({serial}, 10);
        })
    )
      .then(() => done());
  });

  it('waits will all jobs are done', (done: Function) => {
    queue.isNotWorking()
      .then(() => done())
  });

  it('should have processed the parcels with correct order', (done: Function) => {
    setTimeout(() => {
      expect(
        processed
          .map((p: IParcel) => p.serial)
          .join()
      )
        .toBe([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 100, 101].join());
      done();
    }, 100); // wait for the jobs to be added, we should wait for each addJob
  });
});
