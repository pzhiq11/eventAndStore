"use strict";
exports.__esModule = true;
// const isDef = (val) =>
//   val !== "" && val !== undefined && val !== null && String(val) !== "NaN";
// const isUndef = (val) =>
//   val === "" || val === undefined || val === null || String(val) === "NaN";
var isArray = function (val) {
    return typeof val === "object" && {}.toString.call(val) === "[object Array]";
};
// const isObject = (o) => {
//   const type = typeof o;
//   return o != null && (type === "object" || type === "function");
// };
// const isPlainObject = (o) => {
//   const type = typeof o;
//   return (
//     o != null && type === "object" && {}.toString.call(o) === "[object Object]"
//   );
// };
// const isString = (s) => {
//   return typeof s === "string";
// };
var isInteger = function (n) {
    return Number.isInteger(n); // || typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
};
var isNatural = function (n) {
    return isInteger(n) && n >= 0;
};
var pathReg = /\//;
var isComplexPath = function (s) {
    return pathReg.test(s);
};
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
var setValue = function (obj, key, value) {
    if (!isArray(obj)) {
        obj[key] = value;
        return;
    }
    // if isArray, key should be a number
    var index = +key;
    if (!isNatural(index)) {
        return;
    }
    obj.length = Math.max(obj.length, index);
    obj.splice(index, 1, value);
};
var REG_PATH_SPLIT = "/";
var combingPathKey = function (param) {
    var path = param.path || "";
    var keys;
    if (!param.keys) {
        keys = (param.path || "").split(REG_PATH_SPLIT);
    }
    else if (!path) {
        keys = param.keys;
    }
    keys = keys.filter(Boolean);
    // {empty}
    while (~keys.findIndex(function (key) { return key.trim() === ""; })) {
        var _i = keys.findIndex(function (key) { return key.trim() === ""; });
        keys.splice(_i, 1);
    }
    // .
    while (~keys.indexOf(".")) {
        var _i = keys.indexOf(".");
        keys.splice(_i, 1);
    }
    // ..
    while (~keys.indexOf("..")) {
        var _i = keys.indexOf("..");
        keys[_i] = keys[_i - 1] = "";
        delete keys[_i];
        delete keys[_i - 1];
        keys.splice(_i, 1);
        keys.splice(_i - 1, 1);
    }
    var ret = {
        keys: keys,
        path: keys.join(REG_PATH_SPLIT)
    };
    return ret;
};
var dataManager = {
    set: function (data, path, value) {
        path = String(path);
        if (!(data && path)) {
            return null;
        }
        if (!isComplexPath(path)) {
            setValue(data, path, value);
            return data;
        }
        var keys = combingPathKey({ path: path }).keys;
        var tempData = data;
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (data[key] == null) {
                data[key] = {};
            }
            if (i === len - 1) {
                setValue(data, key, value);
            }
            else {
                data = data[key];
            }
        }
        return tempData;
    },
    get: function (data, path) {
        var tempData = data;
        if (tempData == null)
            return tempData;
        path = String(path);
        if (path === "")
            return tempData;
        if (!isComplexPath(path))
            return tempData[path];
        var ret;
        var keys = combingPathKey({ path: path }).keys;
        if (!keys.length) {
            return tempData;
        }
        var len = keys.length;
        for (var i = 0; i < len; ++i) {
            ret = (i ? ret : data)[keys[i]];
            if (ret == null)
                break;
        }
        return ret;
    }
};
var Store = /** @class */ (function () {
    function Store() {
        this.nextTickCalls = [];
        this.store = {};
        this.attachList = [];
        this.pathChangeMap = {};
    }
    Store.prototype._addToStore = function (name, data) {
        if (this.store[name]) {
            console.error("you are setting store namespace [".concat(name, "] more than once"));
        }
        this.store = dataManager.set(this.store, name, data);
    };
    Store.prototype.add = function (path, data) {
        this._addToStore(path, data);
        this._updateHandler(path);
    };
    Store.prototype._handlePathChange = function (path) {
        var _this = this;
        if (!this.pathChangeMap[path]) {
            return;
        }
        this.pathChangeMap[path].forEach(function (listener) {
            var data = dataManager.get(_this.store, _this._formatPath(path));
            listener(data);
        });
    };
    Store.prototype._formatPath = function (path) {
        return path.split(".").join("/");
    };
    Store.prototype.update = function (path, data) {
        var newData = dataManager.set(this.store, this._formatPath(path), data);
        if (newData) {
            this.store = newData;
            this._updateHandler(path);
        }
    };
    Store.prototype.slientUpdate = function (path, data) {
        var newData = dataManager.set(this.store, this._formatPath(path), data);
        if (newData) {
            this.store = newData;
        }
    };
    Store.prototype.nextTick = function (cb) {
        typeof cb === "function" && this.nextTickCalls.push(cb);
    };
    Store.prototype.set = function (subStore) {
        var keys = Object.keys(subStore);
        for (var i in keys) {
            var key = keys[i];
            this._addToStore(key, subStore[key]);
            this._pathUpdate(key);
        }
        this._updateHandler();
    };
    Store.prototype.get = function (name) {
        if (name === undefined) {
            return this.store;
        }
        return dataManager.get(this.store, name.split(".").join("/"));
    };
    Store.prototype.getStore = function () {
        return this.store;
    };
    Store.prototype._updateChildPath = function (path) {
        var keys = Object.keys(this.pathChangeMap);
        for (var k in keys) {
            var key = keys[k];
            if (key !== path && key.indexOf(path) === 0) {
                for (var i = 0; i < this.pathChangeMap[key].length; i++) {
                    this.pathChangeMap[key][i](dataManager.get(this.store, key.split(".").join("/")));
                }
            }
        }
    };
    Store.prototype._pathUpdate = function (path) {
        this._updateChildPath(path);
        path = path.split(".");
        var p = "";
        for (var i in path) {
            p += p ? "." + path[i] : path[i];
            this._handlePathChange(p);
        }
    };
    Store.prototype._updateHandler = function (path) {
        if (path === void 0) { path = ""; }
        //全量订阅
        for (var i in this.attachList) {
            this.attachList[i](this.store, path);
        }
        if (!path)
            return;
        //路径订阅
        this._pathUpdate(path);
    };
    Store.prototype.onChange = function (cb) {
        this.attachList.push(cb);
    };
    Store.prototype._addToPathChange = function (path, cb) {
        if (!this.pathChangeMap[path]) {
            this.pathChangeMap[path] = [];
        }
        this.pathChangeMap[path].push(cb);
    };
    Store.prototype._removeFromPathChange = function (path, cb) {
        if (!this.pathChangeMap[path]) {
            return;
        }
        this.pathChangeMap[path] = this.pathChangeMap[path].filter(function (fn) { return fn !== cb; });
    };
    Store.prototype.on = function (path, cb, forceInit) {
        if (forceInit === void 0) { forceInit = false; }
        if (typeof path !== "string") {
            console.error("only string accept");
            return;
        }
        this._addToPathChange(path, cb);
        if (forceInit) {
            cb(dataManager.get(this.store, this._formatPath(path)));
        }
    };
    Store.prototype.off = function (path, cb) {
        if (typeof path !== "string") {
            throw new Error("store.off path only accept string");
        }
        this._removeFromPathChange(path, cb);
    };
    return Store;
}());
exports["default"] = new Store();
