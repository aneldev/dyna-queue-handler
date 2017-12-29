/// <reference types="node" />
import * as EventEmitter from 'events';
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
    addJob(data: any, priority?: number, group?: string): Promise<IJob>;
    private _addJob(data, priority?, group?);
    viewJobs(group?: string): Promise<IGroupJobsView>;
    private _viewJobs(group?);
    pickJob(priority?: number, group?: string): Promise<IJob>;
    private _pickJob(priority?, group?);
    private _onJobIsWorking;
    on(eventName: string | symbol, listener: Function): any;
    private _callJobListener(forGroup);
    delGroup(group: string): Promise<undefined>;
    delAll(): Promise<undefined>;
    readonly isWorking: boolean;
}
