import {forTimes}         from "dyna-loops";
import {DynaQueueHandler} from "../../src";

const importDynaQueueHandlerModule = async (): Promise<any> => {
  const isNode = !!(typeof process !== 'undefined' && process.versions && process.versions.node);
  return isNode
    ? await import("../../src/node")
    : await import("../../src/web");
};

const importDynaQueueHandlerClass = async (): Promise<typeof DynaQueueHandler> => {
  const module = await importDynaQueueHandlerModule();
  return module.DynaQueueHandler;
};

declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

interface IParcel {
  serial: number;
}

describe('Dyna Queue Handler priority test test', () => {
  const PROCESS_DELAY: number = 100;
  let processed: IParcel[] = [];
  let queue: DynaQueueHandler;
  let _DynaQueueHandler: typeof DynaQueueHandler;

  it('should get the DynaQueueHandler', (done: () => void) => {
    importDynaQueueHandlerClass()
      .then(__DynaQueueHandler => {
        _DynaQueueHandler = __DynaQueueHandler;
        expect(!!_DynaQueueHandler).toBe(true);
        done();
      })
      .catch(error => {
        console.error('Cannot get DynaQueueHandler class reference', error);
        done();
      });
  });

  it('should create the queue', () => {
    queue = new _DynaQueueHandler({
      diskPath: './temp/testDynaQueueHandler-priority-test',
      onJob: (data: IParcel, done: Function) => {
        setTimeout(() => {
          processed.push(data);
          done();
        }, PROCESS_DELAY);
      }
    });
  });

  it('should add 10 jobs with priority 2oo', (done: () => void) => {
    Promise.all(
      Array(10).fill(null)
        .map((v, index) => queue.addJob<IParcel>({serial: index}, 200))
    )
      .then(done);
  });

  it('should add 2 jobs with priority 1o', (done: () => void) => {
    Promise.all(
      Array(2).fill(null)
        .map((v, index) => {
          const serial: number = index + 100;
          queue.addJob<IParcel>({serial}, 10);
        })
    )
      .then(done);
  });

  it('should have processed the parcels with correct order', (done: Function) => {
    setTimeout(() => {
      done();
    }, 100); // wait for the jobs to be added, we should wait for each addJob
  });
});
