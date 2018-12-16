export declare const importUniversal: <TModule>(moduleName: string) => TModule;
export declare const exportNode: (modules: {
    [moduleName: string]: any;
}) => void;
export declare const exportWeb: (modules: {
    [moduleName: string]: any;
}) => void;
