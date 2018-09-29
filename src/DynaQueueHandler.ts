import * as EventEmitter from 'events';
import {DynaDiskMemory}  from "dyna-disk-memory";
import {DynaJobQueue}    from "dyna-job-queue"
import {guid}            from "dyna-guid";

export interface ISettings {
  diskPath: string;
}

export interface IJob {
  id: string;
  arrived: Date;
  priority: Number;
  group: string;
  data: any;
  nextJobId: string;
}

export interface IGroupHandler {
  [priority: number]: {
    nextJobId: string; // next job will be processed
    lastJobId: string; // last job added
    jobsCount: number; // pending jobs
  }
}

export interface IGroupJobsView {
  items: IGroupJobsViewItem[];
  hasJobs: boolean;
}

export interface IGroupJobsViewItem {
  priority: number;
  count: number;
  nextJobId: string; // next job will be processed
  lastJobId: string; // last job added
}

export class DynaQueueHandler extends EventEmitter {
  constructor(settings: ISettings) {
    super();
    this._settings = {
      ...settings,
    };

    this._memory = new DynaDiskMemory({diskPath: this._settings.diskPath});
  }

  private _settings: ISettings;
  private _memory: DynaDiskMemory;
  private _internalJobQueue: DynaJobQueue = new DynaJobQueue();

  public addJob(data: any, priority: number = 1, group: string = '__defaultGroup'): Promise<IJob> {
    return this._internalJobQueue.addJobPromised<IJob>(() => this._addJob(data, priority, group), 1); // internal job queue priority 1
  }

  private async _addJob(data: any, priority: number = 1, group: string = '__defaultGroup'): Promise<IJob> {
    const job: IJob = {
      id: guid(1),
      arrived: new Date(),
      group,
      priority,
      data,
      nextJobId: null,
    };

    // get the container handler (if exists)
    let containerHandler: IGroupHandler = await this._memory.get<IGroupHandler>(group, 'handler');

    // if container handler doesn't exist, create one with virgin values
    if (!containerHandler) containerHandler = {};
    if (!containerHandler[priority]) {
      containerHandler[priority] = {
        nextJobId: job.id,
        lastJobId: null,
        jobsCount: 0,
      };
    }

    // update the current last pushed job, that the next of it is this one
    if (containerHandler[priority].lastJobId) {
      let lastJob: IJob = await this._memory.get<IJob>(group, containerHandler[priority].lastJobId);
      if (lastJob) {
        lastJob.nextJobId = job.id;
        await this._memory.set(group, lastJob.id, lastJob);
      }
      else {
        // This is the case where the lastJob file doesn't exist on the disk for any reason!
        // This might happen because of disk error or the file deletes by someone else (factor or user).
        // As fallback, we reset the container handler in order to continue and work.
        console.error(`DynaQueueHandler: pushJob: The last pushed job with id ${containerHandler[priority].lastJobId} cannot be found on disk! This is probably disk error. ${containerHandler[priority].jobsCount} jobs lost as cannot be tracked. If you see this message often check your disk.`);
        // reset the container handler
        containerHandler[priority].nextJobId = job.id;
        containerHandler[priority].lastJobId = job.id;
        containerHandler[priority].jobsCount = 0;
      }
    }
    else { // the container holder exists, but for this priority there are no items (are consumed previously)
      containerHandler[priority].nextJobId = job.id;
    }

    // save the new job
    await this._memory.set(group, job.id, job);

    // update the container handler and save it
    containerHandler[priority].lastJobId = job.id;
    containerHandler[priority].jobsCount++;
    await this._memory.set(group, 'handler', containerHandler);

    this._callJobListener(group);

    return job;
  }

  // get a view, the number of pending jobs of a group, at this time
  public viewJobs(group: string = '__defaultGroup'): Promise<IGroupJobsView> {
    return this._internalJobQueue.addJobPromised<IGroupJobsView>(() => this._viewJobs(group), 0);
  }

  private _viewJobs(group: string = '__defaultGroup'): Promise<IGroupJobsView> {
    return new Promise((resolve: (view: IGroupJobsView) => void, reject: (error: any) => void) => {
      this._memory.get(group, 'handler')
        .then((groupHandler: IGroupHandler) => {
          let view: IGroupJobsView = {
            items: [],
            hasJobs: false,
          };
          if (groupHandler) {
            Object.keys(groupHandler).forEach((priority: string) => {
              let jobsCount: number = groupHandler[Number(priority)].jobsCount;
              view.items.push({
                priority: Number(priority),
                count: jobsCount, lastJobId:
                groupHandler[Number(priority)].lastJobId,
                nextJobId: groupHandler[Number(priority)].nextJobId,
              });
              if (!!jobsCount) view.hasJobs = true;
            });
            view.items.sort((a: any, b: any) => a.priority - b.priority);
          }
          resolve(view)
        })
        .catch(reject);
    });
  }

  public pickJob(priority: number = undefined, group: string = '__defaultGroup'): Promise<IJob> {
    return this._internalJobQueue.addJobPromised<IJob>(() => this._pickJob(priority, group), 0); // internal job queue priority 0
  }

  private async _pickJob(priority: number = undefined, group: string = '__defaultGroup'): Promise<IJob> {
    if (priority === undefined) {
      const view: IGroupJobsView = await this._viewJobs(group); // call the private version that doesn't use the job queue!
      const groupJobViewItem: IGroupJobsViewItem = view.items
        .filter((item: IGroupJobsViewItem) => !!item.count)
        [0];
      priority = groupJobViewItem && groupJobViewItem.priority;
      if (priority === undefined) return undefined;
    }

    let groupHandler: IGroupHandler = await this._memory.get<IGroupHandler>(group, 'handler');
    let nextJobId: string = groupHandler && groupHandler[priority] && groupHandler[priority].nextJobId;
    let job: IJob = nextJobId && await this._memory.get<IJob>(group, nextJobId);

    if (job) {
      groupHandler[priority].nextJobId = job.nextJobId; // job.nextJobId might be null, this is normal because this is the last one
      groupHandler[priority].jobsCount -= 1;
      if (groupHandler[priority].jobsCount == 0) groupHandler[priority].lastJobId = null;
      await this._memory.set(group, 'handler', groupHandler);
      await this._memory.del(group, job.id);
    }
    return job || undefined;
  }

  private _onJobIsWorking: any = {};

  public on(eventName: string | symbol, listener: Function): any {
    EventEmitter.prototype.on.call(this, eventName, listener);
    if (typeof eventName == 'string') {
      if ((eventName as string).substr(0, 3) == 'job') {
        const group: string = (eventName as string).substr(4) || '__defaultGroup';
        this._callJobListener(group);
      }
    }
    return this;
  }

  private _callJobListener(forGroup: string): Promise<void> {
    // automatically adds this in internal job queue
    return this._internalJobQueue.addJobPromise(async (resolve: (data: any) => void, reject: (error: any) => void) => {
      const eventName: string = forGroup === '__defaultGroup' ? 'job' : `job/${forGroup}`;
      if (this.listenerCount(eventName) && !this._onJobIsWorking[eventName]) {
        const job: IJob = await this._pickJob(undefined, forGroup);
        if (job) {
          this._onJobIsWorking[eventName] = true;
          this.emit(eventName, job, () => {
            this._onJobIsWorking[eventName] = false;
            this._callJobListener(forGroup); // check again for this group
          });
        }
      }
      resolve(undefined);
    }, 0);
  }

  public delGroup(group: string): Promise<void> {
    return this._memory.delContainer(group);
  }

  public delAll(): Promise<void> {
    return this._memory.delAll();
  }

  public get isWorking(): boolean {
    return this._internalJobQueue.isWorking;
  }

}

/*
* Dev note
*
* Containers structure in the dyna disk memory ({DynaDiskMemory} from "dyna-disk-memory")
*   By default, there is no need to provide group. As default the __defaultGroup group is used.
*   Each Group has it's own container where is named with the name of the Group.
*   Each container, has always the key: 'handler' where is a IGroupHandler object
*   where holds the jobs per the assigned priority.
*   Besides the IGroupHandler, each container has the jobs and the key of each job is a guid.
*   In order to add or to pick a job, we have the fetch the IGroupHandler and see
*   which jon is next or last per priority.
*
* Why we use the {DynaJobQueue} from "dyna-job-queue"
*   Since our methods want to do serial transactions to the DynaDiskMemory, without interruption
*   to keep tge data integrity, there is need to call these methods one each time and not when
*   the object user calls a method. So we push the jobs (the Promises in precise) in the DynaJobQueue
*   and each time is executed only one. The DynaJobQueue is used only for this purpose,
*   for internal use.
*
* */

