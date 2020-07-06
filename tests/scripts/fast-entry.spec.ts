import "jest";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import {count} from "dyna-count";
import {DynaDiskMemory} from "dyna-disk-memory/dist/commonJs/node";

import {DynaQueueHandler} from "../../src";
import { DynaRamDisk } from "../utils/DynaRamDisk";
import {delay} from "../../src/utils/delay";

describe('Dyna Queue Handler, fast entry', () => {
  it('add items with 10ms delay', (done: Function) => {
    const COUNT = 10;
    const DELAY = 10;
    let serials: number[] = [];
    const memory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-fast-entry-test',
    });
    const queue = new DynaQueueHandler({
      onJob: async (serial: number) => {
        await delay(DELAY)
        serials.push(serial);
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
    let memory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-fast-entry-test',
    });
    const queue = new DynaQueueHandler({
      onJob: async (serial: number) => {
        serials.push(serial);
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
    let memory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-fast-entry-test',
    });
    const queue = new DynaQueueHandler({
      onJob: async (serial: number) => {
        serials.push(serial);
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
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

  it('add item instantly, should be executed fast', async (done: Function) => {
    let serials: number[] = [];
    let memory = new DynaRamDisk();

    const queue = new DynaQueueHandler({
      onJob: async (serial: number) => {
        serials.push(serial);
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
    });

    await queue.init();

    const started = Date.now();

    await new Promise(r => setTimeout(r, 200))

    await Promise.all(
      count(200)
        .map(index => queue.addJob(index + 100))
    );

    const ended = Date.now();

    const elapsed = ended - started;

    console.debug('Elapsed', elapsed);
    expect(elapsed).toBeLessThan(300);
    expect(serials).toMatchSnapshot();

    await queue.isNotWorking();

    done();
  });

});
