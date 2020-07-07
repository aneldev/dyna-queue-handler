import "jest";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

import { count } from "dyna-count";
import { DynaDiskMemory } from "dyna-disk-memory/dist/commonJs/node";
import { DynaRamDisk } from "../utils/DynaRamDisk";

import { DynaQueueHandler } from "../../src";

describe('Dyna Queue Handler, Parallels with timeout (realistic)', () => {
  let memory: DynaDiskMemory | DynaRamDisk;
  let queue: DynaQueueHandler;
  let processedPackets: number;
  let processingLog: string[] = [];

  beforeAll(() => {
    const memoryType: 'disk' | 'memory' = 'memory';
    let diskMemory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-priority-test',
    });
    let ramMemory = new DynaRamDisk();

    // memory = diskMemory;
    memory = memoryType === 'memory' ? ramMemory : diskMemory;
    processedPackets = 0;

    queue = new DynaQueueHandler({
      autoStart: false,
      parallels: 5,
      onJob: async (data: string) => {
        processingLog.push('Processing start ' + data);
        await new Promise(r => setTimeout(r, 200));
        processedPackets++;
        processingLog.push('Processing completed ' + data);
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
    });
  });

  afterAll(async (done) => {
    await memory.delAll();
    done();
  })

  test('Should execute and the stacked parallel jobs', async (done) => {
    processedPackets = 0;
    await Promise.all(
      count(10)
        .map(index => queue.addJob(`ID-FIRST-${index}`))
    );

    expect(queue.jobsCount).toBe(10);

    expect(processedPackets).toBe(0);

    queue.start();

    expect(processedPackets).toBe(0);

    await queue.allDone();

    expect(processedPackets).toBe(10);

    queue.stop();

    await Promise.all(
      count(10)
        .map(index => queue.addJob(`ID-SECOND-${index}`))
    );

    expect(queue.jobsCount).toBe(10);

    expect(processedPackets).toBe(10);

    queue.start();

    expect(processedPackets).toBe(10);

    await queue.allDone();

    expect(processedPackets).toBe(20);

    queue.stop();

    await Promise.all(
      count(10)
        .map(index => queue.addJob(`ID-THIRD-${index}`))
    );

    expect(queue.jobsCount).toBe(10);

    expect(processedPackets).toBe(20);

    queue.start();

    expect(processedPackets).toBe(20);

    await queue.allDone();

    expect(processedPackets).toBe(30);

    expect(processingLog).toMatchSnapshot();

    done();
  });

});
