export interface IDynaQueueHandlerConfig<TData> {
    diskPath: string;
    parallels?: number;
    onJob: (data: TData, done: () => void) => void;
}
export declare class DynaQueueHandler {
    private _config;
    constructor(_config: IDynaQueueHandlerConfig<any>);
    private _jobsQueue;
    private _callsQueue;
    private _memory;
    private _jobIndex;
    private _hasDiffPriorities;
    private _isWorking;
    private _order;
    private _initialize;
    private _updateIsNotWorking;
    isNotWorking(): Promise<void>;
    addJob<TData>(data: TData, priority?: number): Promise<void>;
    private _addJob;
    readonly hasJobs: boolean;
    readonly jobsCount: number;
    readonly isWorking: boolean;
    private _sortJobs;
}
