(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("dyna-disk-memory"), require("dyna-guid"), require("dyna-job-queue"), require("events"));
	else if(typeof define === 'function' && define.amd)
		define("dyna-queue-handler", ["dyna-disk-memory", "dyna-guid", "dyna-job-queue", "events"], factory);
	else if(typeof exports === 'object')
		exports["dyna-queue-handler"] = factory(require("dyna-disk-memory"), require("dyna-guid"), require("dyna-job-queue"), require("events"));
	else
		root["dyna-queue-handler"] = factory(root["dyna-disk-memory"], root["dyna-guid"], root["dyna-job-queue"], root["events"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DynaQueueHandler_1 = __webpack_require__(1);
exports.DynaQueueHandler = DynaQueueHandler_1.DynaQueueHandler;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(5);
var dyna_disk_memory_1 = __webpack_require__(2);
var dyna_job_queue_1 = __webpack_require__(4);
var dyna_guid_1 = __webpack_require__(3);
var DynaQueueHandler = (function (_super) {
    __extends(DynaQueueHandler, _super);
    function DynaQueueHandler(settings) {
        var _this = _super.call(this) || this;
        _this._internalJobQueue = new dyna_job_queue_1.DynaJobQueue();
        _this._onJobIsWorking = {};
        _this._settings = __assign({}, settings);
        _this._memory = new dyna_disk_memory_1.DynaDiskMemory({ diskPath: _this._settings.diskPath });
        return _this;
    }
    DynaQueueHandler.prototype.addJob = function (data, priority, group) {
        var _this = this;
        if (priority === void 0) { priority = 1; }
        if (group === void 0) { group = '__defaultGroup'; }
        return this._internalJobQueue.addJobPromise(function (resolve, reject) {
            _this._addJob(data, priority, group).then(resolve).catch(reject);
        }, 1); // internal job queue priority 1
    };
    DynaQueueHandler.prototype._addJob = function (data, priority, group) {
        if (priority === void 0) { priority = 1; }
        if (group === void 0) { group = '__defaultGroup'; }
        return __awaiter(this, void 0, void 0, function () {
            var job, containerHandler, lastJob;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        job = {
                            id: dyna_guid_1.guid(1),
                            arrived: new Date(),
                            group: group,
                            priority: priority,
                            data: data,
                            nextJobId: null,
                        };
                        return [4 /*yield*/, this._memory.get(group, 'handler')];
                    case 1:
                        containerHandler = _a.sent();
                        // if container handler doesn't exist, create one with virgin values
                        if (!containerHandler)
                            containerHandler = {};
                        if (!containerHandler[priority]) {
                            containerHandler[priority] = {
                                nextJobId: job.id,
                                lastJobId: null,
                                jobsCount: 0,
                            };
                        }
                        if (!containerHandler[priority].lastJobId) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._memory.get(group, containerHandler[priority].lastJobId)];
                    case 2:
                        lastJob = _a.sent();
                        if (!lastJob) return [3 /*break*/, 4];
                        lastJob.nextJobId = job.id;
                        return [4 /*yield*/, this._memory.set(group, lastJob.id, lastJob)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        // This is the case where the lastJob file doesn't exist on the disk for any reason!
                        // This might happen because of disk error or the file deletes by someone else (factor or user).
                        // As fallback, we reset the container handler in order to continue and work.
                        console.error("DynaQueueHandler: pushJob: The last pushed job with id " + containerHandler[priority].lastJobId + " cannot be found on disk! This is probably disk error. " + containerHandler[priority].jobsCount + " jobs lost as cannot be tracked. If you see this message often check your disk.");
                        // reset the container handler
                        containerHandler[priority].nextJobId = job.id;
                        containerHandler[priority].lastJobId = job.id;
                        containerHandler[priority].jobsCount = 0;
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        containerHandler[priority].nextJobId = job.id;
                        _a.label = 7;
                    case 7: 
                    // save the new job
                    return [4 /*yield*/, this._memory.set(group, job.id, job)];
                    case 8:
                        // save the new job
                        _a.sent();
                        // update the container handler and save it
                        containerHandler[priority].lastJobId = job.id;
                        containerHandler[priority].jobsCount++;
                        return [4 /*yield*/, this._memory.set(group, 'handler', containerHandler)];
                    case 9:
                        _a.sent();
                        this._callJobListener(group);
                        return [2 /*return*/, job];
                }
            });
        });
    };
    // get a view, the number of pending jobs of a group, at this time
    DynaQueueHandler.prototype.viewJobs = function (group) {
        var _this = this;
        if (group === void 0) { group = '__defaultGroup'; }
        return this._internalJobQueue.addJobPromise(function (resolve, reject) {
            _this._viewJobs(group).then(resolve).catch(reject);
        }, 0);
    };
    DynaQueueHandler.prototype._viewJobs = function (group) {
        var _this = this;
        if (group === void 0) { group = '__defaultGroup'; }
        return new Promise(function (resolve, reject) {
            _this._memory.get(group, 'handler')
                .then(function (groupHandler) {
                var view = {
                    items: [],
                    hasJobs: false,
                };
                if (groupHandler) {
                    Object.keys(groupHandler).forEach(function (priority) {
                        var jobsCount = groupHandler[Number(priority)].jobsCount;
                        view.items.push({
                            priority: Number(priority),
                            count: jobsCount, lastJobId: groupHandler[Number(priority)].lastJobId,
                            nextJobId: groupHandler[Number(priority)].nextJobId,
                        });
                        if (!!jobsCount)
                            view.hasJobs = true;
                    });
                    view.items.sort(function (a, b) { return a.priority - b.priority; });
                }
                resolve(view);
            })
                .catch(reject);
        });
    };
    DynaQueueHandler.prototype.pickJob = function (priority, group) {
        var _this = this;
        if (priority === void 0) { priority = undefined; }
        if (group === void 0) { group = '__defaultGroup'; }
        return this._internalJobQueue.addJobPromise(function (resolve, reject) {
            _this._pickJob(priority, group).then(resolve).catch(reject);
        }, 0); // internal job queue priority 0
    };
    DynaQueueHandler.prototype._pickJob = function (priority, group) {
        if (priority === void 0) { priority = undefined; }
        if (group === void 0) { group = '__defaultGroup'; }
        return __awaiter(this, void 0, void 0, function () {
            var view, groupJobViewItem, groupHandler, nextJobId, job, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(priority === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._viewJobs(group)];
                    case 1:
                        view = _b.sent();
                        groupJobViewItem = view.items
                            .filter(function (item) { return !!item.count; })[0];
                        priority = groupJobViewItem && groupJobViewItem.priority;
                        if (priority === undefined)
                            return [2 /*return*/, undefined];
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this._memory.get(group, 'handler')];
                    case 3:
                        groupHandler = _b.sent();
                        nextJobId = groupHandler && groupHandler[priority] && groupHandler[priority].nextJobId;
                        _a = nextJobId;
                        if (!_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._memory.get(group, nextJobId)];
                    case 4:
                        _a = (_b.sent());
                        _b.label = 5;
                    case 5:
                        job = _a;
                        if (!job) return [3 /*break*/, 8];
                        groupHandler[priority].nextJobId = job.nextJobId; // job.nextJobId might be null, this is normal because this is the last one
                        groupHandler[priority].jobsCount -= 1;
                        if (groupHandler[priority].jobsCount == 0)
                            groupHandler[priority].lastJobId = null;
                        return [4 /*yield*/, this._memory.set(group, 'handler', groupHandler)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, this._memory.del(group, job.id)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/, job || undefined];
                }
            });
        });
    };
    DynaQueueHandler.prototype.on = function (eventName, listener) {
        EventEmitter.prototype.on.call(this, eventName, listener);
        if (typeof eventName == 'string') {
            if (eventName.substr(0, 3) == 'job') {
                var group = eventName.substr(4) || '__defaultGroup';
                this._callJobListener(group);
            }
        }
        return this;
    };
    DynaQueueHandler.prototype._callJobListener = function (forGroup) {
        var _this = this;
        // automatically adds this in internal job queue
        return this._internalJobQueue.addJobPromise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var eventName, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventName = forGroup === '__defaultGroup' ? 'job' : "job/" + forGroup;
                        if (!(this.listenerCount(eventName) && !this._onJobIsWorking[eventName])) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._pickJob(undefined, forGroup)];
                    case 1:
                        job = _a.sent();
                        if (job) {
                            this._onJobIsWorking[eventName] = true;
                            this.emit(eventName, job, function () {
                                _this._onJobIsWorking[eventName] = false;
                                _this._callJobListener(forGroup); // check again for this group
                            });
                        }
                        _a.label = 2;
                    case 2:
                        resolve(undefined);
                        return [2 /*return*/];
                }
            });
        }); }, 0);
    };
    DynaQueueHandler.prototype.delGroup = function (group) {
        return this._memory.delContainer(group);
    };
    DynaQueueHandler.prototype.delAll = function () {
        return this._memory.delAll();
    };
    Object.defineProperty(DynaQueueHandler.prototype, "isWorking", {
        get: function () {
            return this._internalJobQueue.isWorking;
        },
        enumerable: true,
        configurable: true
    });
    return DynaQueueHandler;
}(EventEmitter));
exports.DynaQueueHandler = DynaQueueHandler;
/*
* Dev note
*
* Containers structure in the dyna disk memory ({DynaDiskMemory} from "dyna-disk-memory")
*   By default, there is no need to provide group. As default the __defaultGroup group is used.
*   Each Group has it's own container where is named with the name of the Group.
*   Each container, has always the key: 'handler' where is a IGroupHandler object
*   where holds the jobs per the assigned priority.
*   Besides the IGroupHandler, each container has the jobs and the key of each job is a guid.
*   In order to add or to pick a job, we have the fetch the IGroupHandler and see
*   which jon is next or last per priority.
*
* Why we use the {DynaJobQueue} from "dyna-job-queue"
*   Since our methods want to do serial transactions to the DynaDiskMemory, without interruption
*   to keep tge data integrity, there is need to call these methods one each time and not when
*   the object user calls a method. So we push the jobs (the Promises in precise) in the DynaJobQueue
*   and each time is executed only one. The DynaJobQueue is used only for this purpose,
*   for internal use.
*
* */


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("dyna-disk-memory");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("dyna-guid");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("dyna-job-queue");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});