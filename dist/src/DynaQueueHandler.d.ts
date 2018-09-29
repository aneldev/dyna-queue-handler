/// <reference types="node" />
import * as EventEmitter from 'events';
export interface ISettings {
    diskPath: string;
}
export interface IJob<TData> {
    id: string;
    arrived: Date;
    priority: Number;
    group: string;
    data: TData;
    nextJobId: string;
}
export interface IGroupHandler {
    [priority: number]: {
        nextJobId: string;
        lastJobId: string;
        jobsCount: number;
    };
}
export interface IGroupJobsView {
    items: IGroupJobsViewItem[];
    hasJobs: boolean;
}
export interface IGroupJobsViewItem {
    priority: number;
    count: number;
    nextJobId: string;
    lastJobId: string;
}
export declare class DynaQueueHandler extends EventEmitter {
    constructor(settings: ISettings);
    private _settings;
    private _memory;
    private _internalJobQueue;
    addJob<TData>(data: TData, priority?: number, group?: string): Promise<IJob<TData>>;
    private _addJob;
    viewJobs(group?: string): Promise<IGroupJobsView>;
    private _viewJobs;
    pickJob<TData>(priority?: number, group?: string): Promise<IJob<TData>>;
    private _pickJob;
    private _onJobIsWorking;
    on(eventName: string | symbol, listener: Function): any;
    private _callJobListener;
    delGroup(group: string): Promise<void>;
    delAll(): Promise<void>;
    readonly isWorking: boolean;
}
