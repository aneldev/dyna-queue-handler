export interface IDynaQueueHandlerConfig<TData> {
    parallels?: number;
    onJob: (data: TData) => Promise<void>;
    memorySet: (key: string, data: any) => Promise<void>;
    memoryGet: (key: string) => Promise<any>;
    memoryDel: (key: string) => Promise<void>;
    memoryDelAll: () => Promise<void>;
    debugId: string;
}
export declare class DynaQueueHandler {
    private readonly _config;
    constructor(_config: IDynaQueueHandlerConfig<any>);
    private _initialized;
    private _queue;
    private _isWorking;
    private _jobIndex;
    private _jobs;
    private _debugReady;
    init(): Promise<void>;
    isNotWorking(): Promise<void>;
    addJob<TData>(data: TData, priority?: number): Promise<void>;
    private _processQueuedItem;
    readonly hasJobs: boolean;
    readonly jobsCount: number;
    readonly isWorking: boolean;
}
