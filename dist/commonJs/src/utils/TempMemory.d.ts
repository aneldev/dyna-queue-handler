export declare class TempMemory {
    private mem;
    delAll(): Promise<void>;
    set(container: string, key: string, value: any): Promise<void>;
    get(container: string, key: string): Promise<any>;
    del(container: string, key: string): Promise<void>;
}
