import {DynaQueueHandler} from "../../src";
import {delay} from "../../src/utils/delay";

declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

describe('Dyna Queue Handler, fast entry', () => {

  it('add items with 10ms delay', (done: Function) => {
    const COUNT = 10;
    const DELAY = 10;
    let serials: number[] = [];
    const queue = new DynaQueueHandler({
      diskPath: './temp/testDynaQueueHandler-priority-test',
      onJob: async (serial: number) => {
        await delay(DELAY)
        serials.push(serial);
      }
    });

    Promise.resolve()
      .then(() => queue.init())
      .then(() => Promise.all(
        Array(COUNT)
          .fill(null)
          .map((v, index) => index)
          .map(serial => queue.addJob(serial))
      ))
      .then(() => delay(COUNT * (DELAY * 3)))
      .then(() => queue.isNotWorking())
      .then(() => {
        const correct = serials
          .reduce((acc, v) => ({last: v, success: acc.success && v - 1 === acc.last}), {last: -1, success: true})
          .success;
        expect(serials.length).toBe(COUNT);
        expect(correct).toBe(true);
        done();
      })
      .catch(error => {
        console.error('error', error);
        done();
      });
  });

  it('add items with no delay', (done: Function) => {
    const COUNT = 10;
    const DELAY = 4;
    let serials: number[] = [];
    const queue = new DynaQueueHandler({
      diskPath: './temp/testDynaQueueHandler-priority-test',
      onJob: async (serial: number) => {
        serials.push(serial);
      }
    });

    Promise.resolve()
      .then(() => queue.init())
      .then(() => Promise.all(
        Array(COUNT)
          .fill(null)
          .map((v, index) => index)
          .map(serial => queue.addJob(serial))
        )
      )
      .then(() => delay(COUNT * (DELAY * 3)))
      .then(() => queue.isNotWorking())
      .then(() => {
        const correct = serials
          .reduce((acc, v) => ({last: v, success: acc.success && v - 1 === acc.last}), {last: -1, success: true})
          .success;
        expect(serials.length).toBe(COUNT);
        expect(correct).toBe(true);
        done();
      })
      .catch(error => {
        console.error('error', error);
        done();
      });
  });

  it('add item instantly', (done: Function) => {
    let serials: number[] = [];
    const queue = new DynaQueueHandler({
      diskPath: './temp/testDynaQueueHandler-priority-test',
      onJob: async (serial: number) => {
        serials.push(serial);
      }
    });

    Promise.resolve()
      .then(() => queue.init())
      .then(() => queue.addJob(709))
      .then(() => queue.addJob(710))
      .then(() => queue.addJob(711))
      .then(() => queue.isNotWorking())
      .then(() => {
        expect(serials.join()).toBe('709,710,711');
        done();
      })
      .catch(error => {
        console.error('error', error);
        done();
      });
  });

});
