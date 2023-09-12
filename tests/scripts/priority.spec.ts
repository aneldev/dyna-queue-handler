import "jest";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import { count } from "dyna-count";
import { DynaDiskMemory } from "dyna-disk-memory/dist/commonJs/node";

import { DynaQueueHandler } from "../../src";
import { delay } from "../../src/utils/delay";

interface IParcel {
  serial: number;
}

describe('Dyna Queue Handler priority test', () => {
  const PROCESS_DELAY: number = 50;
  const processed: IParcel[] = [];
  let memory = new DynaDiskMemory({
    diskPath: './temp/testDynaQueueHandler-priority-test',
  });
  let queue: DynaQueueHandler;

  it('should create the queue', () => {
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
  });

  it('should add 10 jobs with priority 10', (done) => {
    Promise.all(
      count(10)
        .map(index => queue.addJob({ serial: index }, 10))
    )
      .then(() => done());
  });

  it('should add 4 jobs with priority 2000', (done) => {
    Promise.all(
      count(4)
        .map(index => {
          const serial: number = index + 200;
          queue.addJob({ serial }, 2000);
        })
    )
      .then(() => done());
  });

  it('should add 4 jobs with priority 100', (done) => {
    Promise.all(
      count(4)
        .map(index => {
          const serial: number = index + 100;
          queue.addJob({ serial }, 100);
        })
    )
      .then(() => done());
  });

  it('waits will all jobs are done', (done) => {
    queue.allDone()
      .then(() => done())
  });

  it('should have processed the parcels with correct order', (done) => {
    setTimeout(() => {
      expect(
        processed
          .map((p: IParcel) => p.serial)
          .join()
      )
        .toBe([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
          100, 101, 102, 103,
          200, 201, 202, 203,
        ].join());
      done();
    }, 100); // wait for the jobs to be added, we should wait for each addJob
  });
});
