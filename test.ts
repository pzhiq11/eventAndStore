// 事件分发管理
import myEvent from "./MyEvent";
myEvent.on("click", (time) => console.log("click:", time));
myEvent.emit("click", 2);


// 数据管理
import MyStore from "./MyStore";
MyStore.on("mainDate", (date) => console.log("mainDate:", date));
MyStore.update("mainDate.level", 5);
