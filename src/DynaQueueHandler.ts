import {IDynaDiskMemory} from "dyna-disk-memory/src/interfaces";
import {guid} from "dyna-guid";
import {EErrorType, IError} from "dyna-interfaces";
import {DynaJobQueue} from "dyna-job-queue";
import {isNode} from "./isNode";

export interface IDynaQueueHandlerConfig<TData> {
  diskPath: string;
  parallels?: number;
  onJob: (data: TData, done: () => void) => void;
}

interface IJobIndex {
  jobs: IJobItem[];
}

interface IJobItem {
  jobId: string;
  priority: number;
  order: number;
}

export class DynaQueueHandler {
  constructor(private _config: IDynaQueueHandlerConfig<any>) {
    this._config = {
      parallels: 1,
      ...this._config,
    };

    this._callsQueue = new DynaJobQueue({parallels: 1});
    this._jobsQueue = new DynaJobQueue({parallels: this._config.parallels});

    this._callsQueue.addJobPromised(() => this._initialize());
  }

  private _jobsQueue: DynaJobQueue;
  private _callsQueue: DynaJobQueue;
  private _memory: IDynaDiskMemory;
  private _jobIndex: IJobIndex = {jobs: []};
  private _hasDiffPriorities: boolean = false;
  private _isWorking: boolean = false;
  private _order: number = 0;

  private async _initialize(): Promise<void> {
    try {
      let _DynaDiskMemory;
      if (isNode) {
        _DynaDiskMemory = (await import("dyna-disk-memory/dist/commonJs/node")).DynaDiskMemory;
      } else {
        _DynaDiskMemory = (await import("dyna-disk-memory/dist/commonJs/web")).DynaDiskMemory;
      }
      this._memory = new _DynaDiskMemory({diskPath: this._config.diskPath});
      await this._memory.delAll();
    } catch (error) {
      return Promise.reject({
        code: 1810261314,
        errorType: EErrorType.HW,
        message: 'DynaQueueHandler, error cleaning the previous session',
        error,
      } as IError)
    }
  }

  private _updateIsNotWorking: (() => void)[] = [];

  public isNotWorking(): Promise<void> {
    if (!this.isWorking) return Promise.resolve();
    return new Promise((resolve: () => void) => {
      this._updateIsNotWorking.push(resolve);
    });
  }

  public async addJob<TData>(data: TData, priority: number = 1): Promise<void> {
    return this._callsQueue.addJobPromised(() => {
      return this._addJob(data, priority);
    })
  }

  private async _addJob<TData>(data: TData, priority: number = 1): Promise<void> {
    const jobId: string = guid(1);
    await this._memory.set('data', jobId, data);
    data = null as any; // for GC

    this._jobIndex.jobs.push({jobId, priority, order: this._order++});

    if (
      !this._hasDiffPriorities &&
      this._jobIndex.jobs.length > 1 &&
      this._jobIndex.jobs[this._jobIndex.jobs.length - 2].priority !== priority
    ) {
      this._hasDiffPriorities = true;
    }

    if (this._hasDiffPriorities) this._sortJobs();

    this._jobsQueue.addJobCallback(async (done: () => void) => {
      const jobItem: IJobItem | undefined = this._jobIndex.jobs.shift();
      if (!jobItem) { // this is not possible, is only for TS
        done();
        return;
      }
      if (this._jobIndex.jobs.length === 0) this._hasDiffPriorities = false;
      let data: TData = await this._memory.get<TData>('data', jobItem.jobId);

      this._isWorking = true;
      this._config.onJob(data, () => {
        this._memory.del('data', jobItem.jobId)
          .catch((error: IError) => {
            console.error(
              `DynaQueueHandler: 1810261313 dyna-disk-memory cannot delete this job id [${jobItem.jobId}]
                This is not a critical error (so far), the app is still running without any problem.
                This error is occurred when:
                - There are more than one instances that are using this folder (this is not allowed)
                - A demon is monitoring and blocking the files (like webpack)
                - Or, if this happens in production only, the disk has a problem (check the error)`, error)
          })
          .then(() => {
            // if no jobs, check if notWorking is called and resolve it/them
            if (this._jobsQueue.stats.jobs === 0) {
              while (this._updateIsNotWorking.length) {
                // @ts-ignore
                this._updateIsNotWorking.shift()();
              }
            }
          })
          .then(() => this._isWorking = false)
          .then(done);
      });

      data = null as any; // for GC
    })
  }

  public get hasJobs(): boolean {
    return !!this._jobIndex.jobs.length;
  }

  public get jobsCount(): number {
    return this._jobIndex.jobs.length;
  }

  public get isWorking(): boolean {
    return this._isWorking;
  }

  private _sortJobs(): void {
    let output: IJobItem[] = [];
    this._jobIndex.jobs = this._jobIndex.jobs.sort((jobItemA: IJobItem, jobItemB: IJobItem) => jobItemA.priority - jobItemB.priority);

    const jobs: { [prioriry: string]: IJobItem[] } =
      this._jobIndex.jobs.reduce((acc, jobItem) => {
        if (!acc[jobItem.priority]) acc[jobItem.priority] = [];
        acc[jobItem.priority].push(jobItem);
        return acc;
      }, {});

    Object.keys(jobs)
      .map((priority: string) => jobs[priority])
      .forEach((jobItems: IJobItem[]) => {
        output = output.concat(
          jobItems.sort((jobItemA: IJobItem, jobItemB: IJobItem) => jobItemA.order - jobItemB.order)
        );
      });

    this._jobIndex.jobs = output;
  }
}
