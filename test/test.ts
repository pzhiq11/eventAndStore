// import TutorialManager, { TutorialEventType } from '../src/Guide/TutorialManager';
// import TutorialManager, { TutorialEventType } from '../dist/Guide/TutorialManager';
import esm from "../dist"

//事件管理
esm.event.on("click", (time) => console.log("click:", time));
esm.event.emit("click", 2);
// 数据管理
esm.store.on("mainDate", (date) => console.log("mainDate:", date));
esm.store.update("mainDate.level", "5");