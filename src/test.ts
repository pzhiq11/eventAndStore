import p from './index'
p.event.on("click", (time) => console.log("click:", time));
p.event.emit("click", 2);


// 数据管理
p.store.on("mainDate", (date) => console.log("mainDate:", date));
p.store.update("mainDate.level", 5);
