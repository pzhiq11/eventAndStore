declare class Store {
    store: any;
    nextTickCalls: any;
    attachList: any;
    pathChangeMap: any;
    constructor();
    _addToStore(name: any, data: any): void;
    add(path: any, data: any): void;
    _handlePathChange(path: any): void;
    _formatPath(path: any): any;
    update(path: any, data: any): void;
    slientUpdate(path: any, data: any): void;
    nextTick(cb: any): void;
    set(subStore: any): void;
    get(name: any): any;
    getStore(): any;
    _updateChildPath(path: any): void;
    _pathUpdate(path: any): void;
    _updateHandler(path?: string): void;
    onChange(cb: any): void;
    _addToPathChange(path: any, cb: any): void;
    _removeFromPathChange(path: any, cb: any): void;
    on(path: any, cb: any, forceInit?: boolean): void;
    off(path: any, cb: any): void;
}
declare const _default: Store;
export default _default;
