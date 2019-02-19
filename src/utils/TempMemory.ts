export class TempMemory {
  private mem = {};

  public async delAll(): Promise<void> {
    this.mem = {};
  }

  public async set(container: string, key: string, value: any): Promise<void> {
    if (!this.mem[container]) this.mem[container] = {};
    this.mem[container][key] = value;
  }

  public async get(container: string, key: string): Promise<any> {
    return this.mem[container] && this.mem[container][key];
  }

  public async del(container: string, key: string): Promise<void> {
    if (this.mem[container]) delete this.mem[container][key];
  }
}
