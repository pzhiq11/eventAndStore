// import TutorialManager, { TutorialEventType } from '../src/Guide/TutorialManager';
// import TutorialManager, { TutorialEventType } from '../dist/Guide/TutorialManager';
import esm, { GuideManager,GuideEventType } from "../dist"
//事件管理
esm.event.on("click", (time) => console.log("click:", time));
esm.event.emit("click", 2);
// 数据管理
esm.store.on("mainDate", (date) => console.log("mainDate:", date));
esm.store.update("mainDate.level", "5");

// 初始化教学管理器
async function initGuide() {
    try {
        GuideManager.setUserId('ppp')
        await GuideManager.init();
    } catch (error) {
        console.log('init tutorial error', error);
    }
}
initGuide();
//顺序教学示例
GuideManager.addSequenceTutorial([{
    type: GuideEventType.MxEvent,
    param: "click",
}], {
    name: 'firstGuide',
    onlyOnce: true,
    nextDelayTime: 500,
    canStart: () => {
        return esm.store.get("mainDate.level") === "5"
    },
    onStart() {
        console.log("教学开始", esm.store.get("mainDate.level"));
    },
    onFinish() {
        console.log("教学结束");
    }
})
// 事件教学示例
GuideManager.addEventTutorial([{
    type: GuideEventType.MxEvent,
    param: "eventGuide",
}], [{
    type: GuideEventType.MxEvent,
    param: "GuideClose",
}], {
    name: 'eventGuide',
    onlyOnce: true,
    nextDelayTime: 500,
    canStart: () => {
        return true;
    },
    onStart() {
        console.log("事件教学开始");
    },
    onFinish() {
        console.log("事件教学结束");
    }
})
//顺序教学触发
esm.store.update("mainDate.level", "5");
setTimeout(() => {
    esm.event.emit("click");
}, 3000);
// 信息教学触发
setTimeout(() => {
    esm.event.emit("eventGuide");
    setTimeout(() => {
        esm.event.emit("GuideClose");
    }, 2000);
}, 5000);
