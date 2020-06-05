let keyPrefixGuid = 0;

export class DynaRamDisk {
  private containerPrefix = `drm-${keyPrefixGuid++}--`;

  private ramDiskMemory: { [containerName: string]: { [key: string]: any } } = {};

  public async set<TData>(containerName: string, key: string, data: TData): Promise<void> {
    if (!this.ramDiskMemory[this.containerPrefix + containerName]) this.ramDiskMemory[this.containerPrefix + containerName] = {};
    this.ramDiskMemory[this.containerPrefix + containerName][key] = data;
  }

  public async get<TData>(containerName: string, key: string): Promise<TData | undefined> {
    return this.ramDiskMemory[this.containerPrefix + containerName] && this.ramDiskMemory[this.containerPrefix + containerName][key];
  }

  public async del(containerName: string, key: string): Promise<void> {
    if (this.ramDiskMemory[this.containerPrefix + containerName] && this.ramDiskMemory[this.containerPrefix + containerName][key]) delete this.ramDiskMemory[this.containerPrefix + containerName][key];
  }

  public async delContainer(containerName: string): Promise<void> {
    if (this.ramDiskMemory[this.containerPrefix + containerName]) delete this.ramDiskMemory[this.containerPrefix + containerName];
  }

  public async delAll(): Promise<void> {
    this.ramDiskMemory = {};
  }

  public async clear(): Promise<void> {
    this.ramDiskMemory = {};
  }
}
