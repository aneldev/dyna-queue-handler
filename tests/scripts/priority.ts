import {DynaJobQueue}           from "dyna-job-queue";
import {forTimes}               from "dyna-loops";
import {DynaQueueHandler, IJob} from "../../src";

declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

interface IParcel {
  serial: number;
}


describe('Dyna Queue Handler priority test test', () => {
  const PROCESS_DELAY: number = 100;
  let queue = new DynaQueueHandler({diskPath: './temp/testDynaQueueHandler-priority-test'});
  let processed: IParcel[] = [];
  queue.on('job', (job: IJob<IParcel>, done: Function) => {
    console.debug('--- process 1', job.data.serial);
    setTimeout(() => {
      processed.push(job.data);
      console.debug('--- process 2', job.data.serial);
      done();
    }, PROCESS_DELAY);
  });

  it('should add 10 jobs with priority 2oo', () => {
    forTimes(10, (index: number) => {
      const serial: number = index;
      console.debug('--- add', serial);
      queue.addJob<IParcel>({serial}, 200);
    });
    forTimes(2, (index: number) => {
      const serial: number = index + 10;
      console.debug('--- add', serial);
      queue.addJob<IParcel>({serial}, 10);
    });
  });

  it('should add 2 jobs with priority 1o', () => {
    forTimes(2, (index: number) => {
      const serial: number = index + 100;
      console.debug('--- add', serial);
      queue.addJob<IParcel>({serial}, 10);
    });
  });

  it('should have processed the parcels with correct order', (done: Function) => {
    setTimeout(() => {
      console.debug(processed.map((p: IParcel) => p.serial).join());
      expect(processed.map((p: IParcel) => p.serial).join())
        .toBe([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 100, 101].join())
      done();
    }, ((10 + 2) * PROCESS_DELAY) + 100);
  });
});
