import {guid} from "dyna-guid";

export interface IDynaQueueHandlerConfig<TData> {
  parallels?: number;
  autoStart?: boolean;
  onJob: (data: TData) => Promise<void>;
  memorySet: (key: string, data: TData) => Promise<void>;
  memoryGet: (key: string) => Promise<TData>;
  memoryDel: (key: string) => Promise<void>;
  memoryDelAll: () => Promise<void>;
}

interface IJob {
  index: number;
  jobId: string;
}

export class DynaQueueHandler<TData = any> {
  constructor(private readonly _config: IDynaQueueHandlerConfig<TData>) {
    this._active = this._config.autoStart === undefined
      ? true
      : this._config.autoStart;
  }

  private _guidBase = guid();
  private _guidCount = 0;
  private _active: boolean;
  private _workingParallels: number = 0;

  private _jobIndex: number = 0;
  private _jobs: Array<IJob> = [];
  private _allDoneCallbacks: Array<() => void> = [];

  public start(): void {
    this._active = true;
    this._processQueuedItem();
  }

  public stop(): void {
    this._active = false;
  }

  public allDone(): Promise<void> {
    if (!this.isWorking && !this.hasJobs) return Promise.resolve();
    return new Promise<void>(resolve => this._allDoneCallbacks.push(resolve))
  }

  public async addJob(data: TData, priority: number = 1, _debug_message?: string): Promise<void> {
    const jobId: string = this._guid;
    await this._config.memorySet(jobId, data);

    this._jobs.push({
      index: (priority * 10000000) + (++this._jobIndex),
      jobId,
    });

    this._jobs = this._jobs.sort((a, b) => a.index - b.index);

    this._processQueuedItem();
  }

  private async _processQueuedItem(): Promise<void> {
    if (!this._active) return;
    if (this._workingParallels >= this._configParallels) return;
    try {
      this._workingParallels++;
      const jobItem = this._jobs.shift();
      if (jobItem) {
        const data = await this._config.memoryGet(jobItem.jobId);
        this._config.memoryDel(jobItem.jobId) // Delete this without wait, to improve performance
          .catch(e => console.error('DynaQueueHandler: processQueuedItem, cannot memoryDel', e));
        try {
          this._processQueuedItem();              // Run next parallel
          await this._config.onJob(data);   // Run the current job
        } catch (e) {
          console.error('DynaQueueHandler: onJob error', e);
        }
      }
    } catch (e) {
      console.error('DynaQueueHandler _processQueuedItem error', e);
    } finally {
      this._workingParallels--;
    }

    if (this.hasJobs) {
      this._processQueuedItem();
    }
    else if (!this.isWorking) {
      while (this._allDoneCallbacks.length) {
        // @ts-ignore
        this._allDoneCallbacks.shift()();
      }
    }
  }

  public get jobs(): Promise<TData[]> {
    return Promise.all(
      this._jobs.map(jobItem => this._config.memoryGet(jobItem.jobId))
    );
  }

  public get isWorking(): boolean {
    return this._workingParallels > 0;
  }

  public get hasJobs(): boolean {
    return !!this._jobs.length;
  }

  public get jobsCount(): number {
    return this._jobs.length + this._workingParallels;
  }

  public get processingJobsCount(): number {
    return this._workingParallels;
  }

  private get _configParallels(): number {
    return this._config.parallels === undefined
      ? 1
      : this._config.parallels;
  }

  private get _guid(): string {
    return this._guidBase + (this._guidCount++);
  }
}
