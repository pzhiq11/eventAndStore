import TutorialManager, { TutorialEventType } from './Guide/TutorialManager';
import p from './index'
// p.event.on("click", (time) => console.log("click:", time));
// p.event.emit("click", 2);


// // 数据管理
// p.store.on("mainDate", (date) => console.log("mainDate:", date));
// p.store.update("mainDate.level", "5");

async function initGuide() {
    try {
        await TutorialManager.init();
    } catch (error) {
        console.log('init tutorial error', error);
    }
}
initGuide();
//顺序教学示例
TutorialManager.addSequenceTutorial([{
    type: TutorialEventType.MxEvent,
    param: "click",
}], {
    name: 'firstGuide',
    onlyOnce: true,
    nextDelayTime: 500,
    canStart: () => {
        return p.store.get("mainDate.level") === "5"
    },
    onStart() {
        console.log("教学开始", p.store.get("mainDate.level"));
    },
    onFinish() {
        console.log("教学结束");
    }
})
// 事件教学示例
TutorialManager.addEventTutorial([{
    type: TutorialEventType.MxEvent,
    param: "eventGuide",
}], [{
    type: TutorialEventType.MxEvent,
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
p.store.update("mainDate.level", "5");
setTimeout(() => {
    p.event.emit("click", 2);
}, 2000);
setTimeout(() => {
    p.event.emit("eventGuide");
    setTimeout(() => {
        p.event.emit("GuideClose");
    }, 2000);
}, 4000);
