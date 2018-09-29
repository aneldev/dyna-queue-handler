export interface IDynaQueueHandlerConfig<TData> {
    diskPath: string;
    parallels?: number;
    onJob: (data: TData, done: () => void) => void;
}
export declare class DynaQueueHandler {
    private _config;
    constructor(_config: IDynaQueueHandlerConfig<any>);
    private _queue;
    private _memory;
    private _jobIndex;
    private _hasDiffPriorities;
    private _isWorking;
    private _order;
    addJob<TData>(data: TData, priority?: number): Promise<void>;
    readonly hasJobs: boolean;
    readonly jobsCount: number;
    readonly isWorking: boolean;
    private _sortJobs;
}
