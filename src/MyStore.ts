// const isDef = (val) =>
//   val !== "" && val !== undefined && val !== null && String(val) !== "NaN";
// const isUndef = (val) =>
//   val === "" || val === undefined || val === null || String(val) === "NaN";
const isArray = (val) =>
  typeof val === "object" && {}.toString.call(val) === "[object Array]";
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
const isInteger = (n) => {
  return Number.isInteger(n); // || typeof n === 'number' && isFinite(n) && Math.ceil(n) === n
};
const isNatural = (n) => {
  return isInteger(n) && n >= 0;
};
const pathReg = /\//;
const isComplexPath = (s) => {
  return pathReg.test(s);
};
/**
 * 让数组的变化可被监听
 * @param obj
 * @param key
 * @param value
 */
const setValue = (obj, key, value) => {
  if (!isArray(obj)) {
    obj[key] = value;
    return;
  }
  // if isArray, key should be a number
  let index = +key;
  if (!isNatural(index)) {
    return;
  }
  obj.length = Math.max(obj.length, index);
  obj.splice(index, 1, value);
};
const REG_PATH_SPLIT = "/";
const combingPathKey = (param) => {
  const path = param.path || "";
  let keys;
  if (!param.keys) {
    keys = (param.path || "").split(REG_PATH_SPLIT);
  } else if (!path) {
    keys = param.keys;
  }
  keys = keys.filter(Boolean);
  // {empty}
  while (~keys.findIndex((key) => key.trim() === "")) {
    let _i = keys.findIndex((key) => key.trim() === "");
    keys.splice(_i, 1);
  }
  // .
  while (~keys.indexOf(".")) {
    let _i = keys.indexOf(".");
    keys.splice(_i, 1);
  }
  // ..
  while (~keys.indexOf("..")) {
    let _i = keys.indexOf("..");
    keys[_i] = keys[_i - 1] = "";
    delete keys[_i];
    delete keys[_i - 1];
    keys.splice(_i, 1);
    keys.splice(_i - 1, 1);
  }
  const ret = {
    keys,
    path: keys.join(REG_PATH_SPLIT),
  };
  return ret;
};

const dataManager = {
  set: (data, path, value) => {
    path = String(path);
    if (!(data && path)) {
      return null;
    }
    if (!isComplexPath(path)) {
      setValue(data, path, value);
      return data;
    }
    const keys = combingPathKey({ path }).keys;
    const tempData = data;
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i];
      if (data[key] == null) {
        data[key] = {};
      }
      if (i === len - 1) {
        setValue(data, key, value);
      } else {
        data = data[key];
      }
    }
    return tempData;
  },
  get: (data, path) => {
    const tempData = data;
    if (tempData == null) return tempData;
    path = String(path);
    if (path === "") return tempData;
    if (!isComplexPath(path)) return tempData[path];
    let ret;
    const keys = combingPathKey({ path }).keys;
    if (!keys.length) {
      return tempData;
    }
    const len = keys.length;
    for (let i = 0; i < len; ++i) {
      ret = (i ? ret : data)[keys[i]];
      if (ret == null) break;
    }
    return ret;
  },
};

class Store {
  
  public store: any;
  public nextTickCalls;
  public attachList;
  public pathChangeMap;
  constructor() {
    this.nextTickCalls = [];
    this.store = {};
    this.attachList = [];
    this.pathChangeMap = {};
  }

  _addToStore(name, data) {
    if (this.store[name]) {
      console.error(`you are setting store namespace [${name}] more than once`);
    }
    this.store = dataManager.set(this.store, name, data);
  }
  add(path, data) {
    this._addToStore(path, data);
    this._updateHandler(path);
  }
  _handlePathChange(path) {
    if (!this.pathChangeMap[path]) {
      return;
    }
    this.pathChangeMap[path].forEach((listener) => {
      const data = dataManager.get(this.store, this._formatPath(path));
      listener(data);
    });
  }
  _formatPath(path) {
    return path.split(".").join("/");
  }
  update(path, data) {
    const newData = dataManager.set(this.store, this._formatPath(path), data);
    if (newData) {
      this.store = newData;
      this._updateHandler(path);
    }
  }
  slientUpdate(path, data) {
    const newData = dataManager.set(this.store, this._formatPath(path), data);
    if (newData) {
      this.store = newData;
    }
  }
  nextTick(cb) {
    typeof cb === "function" && this.nextTickCalls.push(cb);
  }
  set(subStore) {
    let keys = Object.keys(subStore);
    for (let i in keys) {
      let key = keys[i];
      this._addToStore(key, subStore[key]);
      this._pathUpdate(key);
    }
    this._updateHandler();
  }
  get(name) {
    if (name === undefined) {
      return this.store;
    }
    return dataManager.get(this.store, name.split(".").join("/"));
  }
  getStore() {
    return this.store;
  }
  _updateChildPath(path) {
    const keys = Object.keys(this.pathChangeMap);
    for (let k in keys) {
      let key = keys[k];
      if (key !== path && key.indexOf(path) === 0) {
        for (let i = 0; i < this.pathChangeMap[key].length; i++) {
          this.pathChangeMap[key][i](
            dataManager.get(this.store, key.split(".").join("/"))
          );
        }
      }
    }
  }
  _pathUpdate(path) {
    this._updateChildPath(path);
    path = path.split(".");
    let p = "";
    for (let i in path) {
      p += p ? "." + path[i] : path[i];
      this._handlePathChange(p);
    }
  }
  _updateHandler(path = "") {
    //全量订阅
    for (let i in this.attachList) {
      this.attachList[i](this.store, path);
    }
    if (!path) return;
    //路径订阅
    this._pathUpdate(path);
  }
  onChange(cb) {
    this.attachList.push(cb);
  }
  _addToPathChange(path, cb) {
    if (!this.pathChangeMap[path]) {
      this.pathChangeMap[path] = [];
    }
    this.pathChangeMap[path].push(cb);
  }
  _removeFromPathChange(path, cb) {
    if (!this.pathChangeMap[path]) {
      return;
    }
    this.pathChangeMap[path] = this.pathChangeMap[path].filter(
      (fn) => fn !== cb
    );
  }
  on(path, cb, forceInit = false) {
    if (typeof path !== "string") {
      console.error("only string accept");
      return;
    }
    this._addToPathChange(path, cb);
    if (forceInit) {
      cb(dataManager.get(this.store, this._formatPath(path)));
    }
  }
  off(path, cb) {
    if (typeof path !== "string") {
      throw new Error("store.off path only accept string");
    }
    this._removeFromPathChange(path, cb);
  }
}

export default new Store();
