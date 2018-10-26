import {forTimes}         from "dyna-loops";
import {DynaQueueHandler} from "../../src";

declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

interface IParcel {
  serial: number;
}

describe('Dyna Queue Handler priority test test', () => {
  const PROCESS_DELAY: number = 100;
  let processed: IParcel[] = [];
  let queue: DynaQueueHandler;

  it('should create the queue', () => {
    queue = new DynaQueueHandler({
      diskPath: './temp/testDynaQueueHandler-priority-test',
      onJob: (data: IParcel, done: Function) => {
        setTimeout(() => {
          processed.push(data);
          done();
        }, PROCESS_DELAY);
      }
    });
  });

  it('should add 10 jobs with priority 2oo', () => {
    forTimes(10, (index: number) => {
      const serial: number = index;
      queue.addJob<IParcel>({serial}, 200);
    });
  });

  it('should add 2 jobs with priority 1o', () => {
    forTimes(2, (index: number) => {
      const serial: number = index + 100;
      queue.addJob<IParcel>({serial}, 10);
    });
  });

  it('should have processed the parcels with correct order', (done: Function) => {
    setTimeout(() => {
      expect(processed.map((p: IParcel) => p.serial).join())
        .toBe([0, 100, 101, 1, 2, 3, 4, 5, 6, 7, 8, 9].join());
      done();
    }, ((10 + 2) * PROCESS_DELAY) + 500);
  });
});
