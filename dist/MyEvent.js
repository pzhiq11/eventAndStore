"use strict";
exports.__esModule = true;
var MyEvent = /** @class */ (function () {
    function MyEvent() {
        // public static inst: MyEvent = new MyEvent();
        this.eventDic = new Map();
    }
    MyEvent.prototype.on = function (eventName, fn, ctx) {
        var _a;
        if (this.eventDic.has(eventName)) {
            (_a = this.eventDic.get(eventName)) === null || _a === void 0 ? void 0 : _a.push({ fn: fn, ctx: ctx });
        }
        else {
            this.eventDic.set(eventName, [{ fn: fn, ctx: ctx }]);
        }
    };
    MyEvent.prototype.off = function (eventName, fn) {
        var _a, _b;
        if (this.eventDic.has(eventName)) {
            var idx = (_a = this.eventDic.get(eventName)) === null || _a === void 0 ? void 0 : _a.findIndex(function (item) { return item.fn === fn; });
            idx > -1 && ((_b = this.eventDic.get(eventName)) === null || _b === void 0 ? void 0 : _b.splice(idx, 1));
        }
    };
    MyEvent.prototype.emit = function (emitName) {
        var _a;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this.eventDic.has(emitName)) {
            (_a = this.eventDic.get(emitName)) === null || _a === void 0 ? void 0 : _a.forEach(function (_a) {
                var fn = _a.fn, ctx = _a.ctx;
                ctx ? fn.apply(ctx, params) : fn.apply(void 0, params);
            });
        }
    };
    MyEvent.prototype.clear = function () {
        this.eventDic.clear();
    };
    return MyEvent;
}());
exports["default"] = new MyEvent();
