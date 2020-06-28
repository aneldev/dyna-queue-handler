import "jest";

import { count } from "dyna-count";
import { DynaDiskMemory } from "dyna-disk-memory/dist/commonJs/node";
import { DynaRamDisk } from "../utils/DynaRamDisk";

import { DynaQueueHandler } from "../../src";

describe('Dyna Queue Handler, Parallels Massive', () => {
  let memory: DynaDiskMemory | DynaRamDisk;
  let queue: DynaQueueHandler;
  let processedPackets: number;

  beforeAll((done) => {
    const memoryType: 'disk' | 'memory' = 'memory';
    let diskMemory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-priority-test',
    });
    let ramMemory = new DynaRamDisk();

    memory = memoryType === 'memory' ? ramMemory : diskMemory;
    processedPackets = 0;

    queue = new DynaQueueHandler({
      autoStart: true,
      parallels: 50,
      onJob: async () => {
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

  test('Should execute and the stacked parallel jobs fast', async (done) => {
    count(100)
      .for(index => {
        setTimeout(() => queue.addJob(null), index * 2)
      });

    await new Promise(r => setTimeout(r, 1400));
    expect(processedPackets).toBe(100);

    await queue.isNotWorking();

    done();
  });
});
