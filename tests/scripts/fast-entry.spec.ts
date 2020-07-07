import "jest";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import {count} from "dyna-count";
import {DynaDiskMemory} from "dyna-disk-memory/dist/commonJs/node";

import {DynaQueueHandler} from "../../src";
import { DynaRamDisk } from "../utils/DynaRamDisk";
import {delay} from "../../src/utils/delay";

describe('Dyna Queue Handler, fast entry', () => {
  it('add items with 10ms delay', (done) => {
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
      .then(() => Promise.all(
        count(COUNT)
          .map(serial => queue.addJob(serial))
      ))
      .then(() => delay(COUNT * (DELAY * 3)))
      .then(() => queue.allDone())
      .then(() => {
        const correct = serials
          .reduce((acc, v) => ({last: v, success: acc.success && v - 1 === acc.last}), {last: -1, success: true})
          .success;
        expect(serials.length).toBe(COUNT);
        expect(correct).toBe(true);
        done();
      })
      .catch(fail)
      .then(done);
  });

  it('add items with no delay', (done) => {
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
      .then(() => Promise.all(
        count(COUNT)
          .map(serial => queue.addJob(serial))
        )
      )
      .then(() => delay(COUNT * (DELAY * 3)))
      .then(() => queue.allDone())
      .then(() => {
        const correct = serials
          .reduce((acc, v) => ({last: v, success: acc.success && v - 1 === acc.last}), {last: -1, success: true})
          .success;
        expect(serials.length).toBe(COUNT);
        expect(correct).toBe(true);
        done();
      })
      .catch(fail)
      .then(done);
  });

  it('add item instantly', (done) => {
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
      .then(() => queue.addJob(709))
      .then(() => queue.addJob(710))
      .then(() => queue.addJob(711))
      .then(() => queue.allDone())
      .then(() => {
        expect(serials.join()).toBe('709,710,711');
      })
      .catch(fail)
      .then(done);
  });

  it('add item instantly with priority', async (done) => {
    let serials: number[] = [];
    let memory = new DynaRamDisk();
    const queue = new DynaQueueHandler({
      autoStart: false,
      onJob: async (serial: number) => {
        serials.push(serial);
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
    });

    await queue.addJob(709, 3);
    await queue.addJob(710, 2);
    await queue.addJob(711);

    queue.start();
    await queue.allDone();

    expect(serials.join()).toBe('711,710,709');
    expect(queue.hasJobs).toBe(false);
    expect(queue.isWorking).toBe(false);
    expect(queue.jobsCount).toBe(0);

    done();
  });

  it('add item instantly, should be executed fast', async (done) => {
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

    const started = Date.now();

    await new Promise(r => setTimeout(r, 200))

    await Promise.all(
      count(200)
        .map(index => queue.addJob(index + 100))
    );

    await queue.allDone();

    const ended = Date.now();

    const elapsed = ended - started;

    console.log('Elapsed', elapsed);
    expect(elapsed).toBeLessThan(300);
    expect(serials).toMatchSnapshot();

    done();
  });

});
