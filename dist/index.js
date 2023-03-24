"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideEventType = exports.GuideManager = void 0;
var MyEvent_1 = require("./MyEvent");
var MyStore_1 = require("./MyStore");
var TutorialManager_1 = require("./Guide/TutorialManager");
exports.GuideManager = TutorialManager_1.default;
exports.GuideEventType = TutorialManager_1.TutorialEventType;
exports.default = {
    event: MyEvent_1.default,
    store: MyStore_1.default,
};
