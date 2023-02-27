interface EventItem {
  fn: Function;
  ctx: unknown;
}
class MyEvent {
  // public static inst: MyEvent = new MyEvent();
  public eventDic: Map<string, Array<EventItem>> = new Map();

  on(eventName: string, fn: Function, ctx?: unknown) {
    if (this.eventDic.has(eventName)) {
      this.eventDic.get(eventName)?.push({ fn, ctx });
    } else {
      this.eventDic.set(eventName, [{ fn, ctx }]);
    }
  }

  off(eventName: string, fn: Function) {
    if (this.eventDic.has(eventName)) {
      const idx = this.eventDic.get(eventName)?.findIndex((item) => item.fn === fn);
      idx > -1 && this.eventDic.get(eventName)?.splice(idx, 1);
    }
  }

  emit(emitName: string, ...params: unknown[]) {
    if (this.eventDic.has(emitName)) {
      this.eventDic.get(emitName)?.forEach(({ fn, ctx }) => {
        ctx ? fn.apply(ctx, params) : fn(...params);
      });
    }
  }

  clear() {
    this.eventDic.clear();
  }
}
export default new MyEvent();
