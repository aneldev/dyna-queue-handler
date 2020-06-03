import "jest";

import { DynaDiskMemory } from "dyna-disk-memory/dist/commonJs/node";
import { DynaRamDisk } from "../utils/DynaRamDisk";

import { DynaQueueHandler } from "../../src";

interface IParcel {
  address: string;
  serial: number;
}

describe('Dyna Queue Handler, Performance', () => {
  let memory: DynaDiskMemory | DynaRamDisk;
  let queue: DynaQueueHandler;
  let processedPackets: IParcel[] = [];
  let lastPacketAddedAt: number;

  const fetch = async (address: string): Promise<IParcel> => ({
    address,
    serial: Math.random(),
  });

  beforeAll((done) => {
    let diskMemory = new DynaDiskMemory({
      diskPath: './temp/testDynaQueueHandler-priority-test',
    });
    let ramMemory = new DynaRamDisk();

    // memory = diskMemory;
    memory = ramMemory;
    processedPackets = [];

    queue = new DynaQueueHandler({
      autoStart: false,
      onJob: async (address: string) => {
        const parcel = await fetch(address);
        processedPackets.push(parcel);
        lastPacketAddedAt = Date.now();
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

  test('Load some packets', async (done) => {
    const PACKETS_COUNT = 3000;
    let loadStart: number = -1;
    let loadEnd: number = -1;
    let executeStart: number = -1;
    let executeEnd: number = -1;

    await Promise.all(Array(PACKETS_COUNT)
      .fill(null)
      .map((v, index) => {
        if (index === 0) loadStart = Date.now()
        return queue.addJob(`address-${index}`);
      })
    );
    loadEnd = Date.now();
    console.log('Adding to queue', loadEnd - loadStart);

    expect(processedPackets.length).toBe(0);
    expect(queue.hasJobs).toBe(true);
    expect(queue.jobsCount).toBe(PACKETS_COUNT);

    executeStart = Date.now();
    queue.start();

    await queue.isNotWorking();

    executeEnd = Date.now();
    console.log('Execution', executeEnd - executeStart);

    expect(processedPackets.length).toBe(PACKETS_COUNT);

    done();
  });


});
