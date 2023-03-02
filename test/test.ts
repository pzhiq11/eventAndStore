// 事件分发管理
import p from "../dist/index.js"
p.event.on("click", (time) => console.log("click:", time));
p.event.emit("click", 2);


// 数据管理
p.store.on("mainDate", (date) => console.log("mainDate:", date));
p.store.update("mainDate.level", 5);
