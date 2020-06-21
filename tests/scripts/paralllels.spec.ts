import "jest";

import { count } from "dyna-count";
import { DynaDiskMemory } from "dyna-disk-memory/dist/commonJs/node";
import { DynaRamDisk } from "../utils/DynaRamDisk";

import { DynaQueueHandler } from "../../src";

describe('Dyna Queue Handler, Parallels', () => {
  let memory: DynaDiskMemory | DynaRamDisk;
  let queue: DynaQueueHandler;
  let processedPackets: number;

  beforeAll((done) => {
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
      onJob: async () => {
        await new Promise(r => setTimeout(r, 300));
        processedPackets++;
      },
      memorySet: (key, data) => memory.set('data', key, data),
      memoryGet: (key) => memory.get('data', key),
      memoryDel: (key) => memory.del('data', key),
      memoryDelAll: () => memory.delAll(),
    });

    queue.init().then(() => done());
  });

  afterAll(async (done) => {
    await memory.delAll();
    done();
  })

  test('Should execute and the stacked parallel jobs', async (done) => {
    queue.start();

    count(10)
      .for(() => queue.addJob(null));

    await new Promise(r => setTimeout(r, 400));
    expect(processedPackets).toBeGreaterThanOrEqual(5);
    expect(processedPackets).toBeLessThan(10);

    await new Promise(r => setTimeout(r, 400));
    expect(processedPackets).toBe(10);

    await queue.isNotWorking();

    done();
  });


});
