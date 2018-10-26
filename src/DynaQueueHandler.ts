import {IError}         from "dyna-interfaces";
import {DynaDiskMemory} from "dyna-disk-memory";
import {guid}           from "dyna-guid";
import {DynaJobQueue}   from "dyna-job-queue";

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

    this._memory = new DynaDiskMemory({diskPath: this._config.diskPath});
    this._queue = new DynaJobQueue({parallels: this._config.parallels});

    this._memory.delAll()
      .catch((error: IError) => {
        console.error(`DynaQueueHandler, error cleaning the previous session`, error);
      });
  }

  private _queue: DynaJobQueue;
  private _memory: DynaDiskMemory;
  private _jobIndex: IJobIndex = {jobs: []};
  private _hasDiffPriorities: boolean = false;
  private _isWorking: boolean = false;
  private _order: number = 0;

  public async addJob<TData>(data: TData, priority: number = 1): Promise<void> {
    const jobId: string = guid(1);
    await this._memory.set('data', jobId, data);
    data = null; // for GC

    this._jobIndex.jobs.push({jobId, priority, order: this._order++});

    if (
      !this._hasDiffPriorities &&
      this._jobIndex.jobs.length > 1 &&
      this._jobIndex.jobs[this._jobIndex.jobs.length - 2].priority !== priority
    ) {
      this._hasDiffPriorities = true;
    }

    if (this._hasDiffPriorities) this._sortJobs();

    this._queue.addJobCallback(async (done: () => void) => {
      const jobItem: IJobItem = this._jobIndex.jobs.shift();
      if (this._jobIndex.jobs.length === 0) this._hasDiffPriorities = false;
      let data: TData = await this._memory.get<TData>('data', jobItem.jobId);

      this._isWorking = true;
      this._config.onJob(data, () => {
        this._isWorking = false;
        done();
        this._memory.del('data', jobItem.jobId)
          .catch((error:IError)=>{
            console.error(`DynaQueueHandler: dyna-disk-memory cannot delete this job id [${jobItem.jobId}]`, error)
          });
      });

      data = null; // for GC
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
