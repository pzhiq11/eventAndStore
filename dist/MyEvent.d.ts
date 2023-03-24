export interface EventItem {
    fn: Function;
    ctx: unknown;
}
declare class MyEvent {
    eventDic: Map<string, Array<EventItem>>;
    on(eventName: string, fn: Function, ctx?: unknown): void;
    off(eventName: string, fn: Function): void;
    emit(emitName: string, ...params: unknown[]): void;
    clear(): void;
}
declare const _default: MyEvent;
export default _default;
