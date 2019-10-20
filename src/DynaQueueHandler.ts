import {guid} from "dyna-guid";
import {EErrorType, IError} from "dyna-interfaces";
import {DynaJobQueue} from "dyna-job-queue/dist/commonJs";

export interface IDynaQueueHandlerConfig<TData> {
  parallels?: number;
  onJob: (data: TData) => Promise<void>;
  memorySet: (key: string, data: any) => Promise<void>;
  memoryGet: (key: string) => Promise<any>;
  memoryDel: (key: string) => Promise<void>;
  memoryDelAll: () => Promise<void>;
}

export class DynaQueueHandler {
  constructor(private readonly _config: IDynaQueueHandlerConfig<any>) {
    this._config = {
      parallels: 1,
      ...this._config,
    };
  }

  private _initialized = false;
  private _queue: DynaJobQueue; // is used to serialize the methods of this class only
  private _isWorking: boolean = false;

  private _jobIndex: number = 0;
  private _jobs: Array<{ index: number, jobId: string }> = [];

  public async init(): Promise<void> {
    if (this._initialized) return;
    this._initialized = true;

    try {
      this._queue = new DynaJobQueue({parallels: this._config.parallels});
      this.addJob = this._queue.jobFactory(this.addJob.bind(this));
      this._processQueuedItem = this._queue.jobFactory(this._processQueuedItem.bind(this));
      await this._config.memoryDelAll();
    } catch (error) {
      throw {
        code: 1810261314,
        errorType: EErrorType.HW,
        message: 'DynaQueueHandler, error cleaning the previous session',
        error,
      } as IError;
    }
  }

  public async isNotWorking(): Promise<void> {
    if (!this.isWorking) return;

    return this._queue.addJobPromised(async () => {
      if (!this.isWorking) return; else throw {};
    })
      .catch(() => this.isNotWorking());
  }

  public async addJob<TData>(data: TData, priority: number = 1): Promise<void> {
    if (!this._initialized) {
      const errorMessage = 'DynaQueueHandler is not initialized! Call `.init()` where is `:Promise<void>` before any call.';
      console.error(errorMessage);
      throw {message: errorMessage};
    }

    const jobId: string = guid(1);
    await this._config.memorySet(jobId, data);

    this._jobs.push({
      index: (priority * 10000000) + (++this._jobIndex),
      jobId,
    });

    this._jobs = this._jobs.sort((a, b) => a.index - b.index);

    this._processQueuedItem();
  }

  private async _processQueuedItem(): Promise<void> {
    try {
      this._isWorking = true;
      const jobItem = this._jobs.shift();
      if (jobItem) {
        const data = await this._config.memoryGet(jobItem.jobId);
        await this._config.memoryDel(jobItem.jobId);
        try {
          await this._config.onJob(data);
        } catch (e) {
          // swallow the error, we don't care of it
        }
      }
      this._isWorking = false;
    } catch (e) {
      console.error('DynaQueueHandler _processQueuedItem error', e);
      this._isWorking = false;
    }
  }

  public get hasJobs(): boolean {
    return !!this.jobsCount;
  }

  public get jobsCount(): number {
    return this._jobs.length;
  }

  public get isWorking(): boolean {
    return this.hasJobs || this._isWorking;
  }
}
