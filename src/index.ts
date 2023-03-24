import event from "./MyEvent";
import store from "./MyStore";
import TutorialManageObj, { TutorialEventType, TutorialManager } from "./Guide/TutorialManager"

export const GuideManager: TutorialManager = TutorialManageObj;
export const GuideEventType = TutorialEventType;
export default {
  event,
  store,
};
