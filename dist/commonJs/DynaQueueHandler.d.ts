export interface IDynaQueueHandlerConfig<TData> {
    parallels?: number;
    autoStart?: boolean;
    onJob: (data: TData) => Promise<void>;
    memorySet: (key: string, data: TData) => Promise<void>;
    memoryGet: (key: string) => Promise<TData>;
    memoryDel: (key: string) => Promise<void>;
    memoryDelAll: () => Promise<void>;
}
export declare class DynaQueueHandler<TData = any> {
    private readonly _config;
    constructor(_config: IDynaQueueHandlerConfig<TData>);
    private _guidBase;
    private _guidCount;
    private _active;
    private _workingParallels;
    private _jobIndex;
    private _jobs;
    private _allDoneCallbacks;
    start(): void;
    stop(): void;
    allDone(): Promise<void>;
    addJob(data: TData, priority?: number, _debug_message?: string): Promise<void>;
    private _processQueuedItem;
    readonly jobs: Promise<TData[]>;
    readonly isWorking: boolean;
    readonly hasJobs: boolean;
    readonly jobsCount: number;
    readonly processingJobsCount: number;
    private readonly _configParallels;
    private readonly _guid;
}
