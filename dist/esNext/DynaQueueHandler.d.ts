export interface IDynaQueueHandlerConfig<TData> {
    parallels?: number;
    autoStart?: boolean;
    onJob: (data?: TData) => Promise<void>;
    memorySet: (key: string, data: any) => Promise<void>;
    memoryGet: (key: string) => Promise<any>;
    memoryDel: (key: string) => Promise<void>;
    memoryDelAll: () => Promise<void>;
}
export declare class DynaQueueHandler {
    private readonly _config;
    constructor(_config: IDynaQueueHandlerConfig<any>);
    private _initialized;
    private _active;
    private _queue;
    private _isWorking;
    private _jobIndex;
    private _jobs;
    init(): Promise<void>;
    start(): void;
    stop(): void;
    isNotWorking(): Promise<void>;
    addJob<TData>(data?: TData, priority?: number): Promise<void>;
    private _processQueuedItem;
    readonly jobs: Promise<any[]>;
    readonly hasJobs: boolean;
    readonly jobsCount: number;
    readonly processingJobsCount: number;
    readonly isWorking: boolean;
}
