(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("dyna-disk-memory"), require("dyna-guid"), require("dyna-interfaces"), require("dyna-job-queue"));
	else if(typeof define === 'function' && define.amd)
		define("dyna-queue-handler", ["dyna-disk-memory", "dyna-guid", "dyna-interfaces", "dyna-job-queue"], factory);
	else if(typeof exports === 'object')
		exports["dyna-queue-handler"] = factory(require("dyna-disk-memory"), require("dyna-guid"), require("dyna-interfaces"), require("dyna-job-queue"));
	else
		root["dyna-queue-handler"] = factory(root["dyna-disk-memory"], root["dyna-guid"], root["dyna-interfaces"], root["dyna-job-queue"]);
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var dyna_disk_memory_1 = __webpack_require__(2);
var dyna_guid_1 = __webpack_require__(3);
var dyna_interfaces_1 = __webpack_require__(4);
var dyna_job_queue_1 = __webpack_require__(5);
var DynaQueueHandler = /** @class */ (function () {
    function DynaQueueHandler(_config) {
        var _this = this;
        this._config = _config;
        this._jobIndex = { jobs: [] };
        this._hasDiffPriorities = false;
        this._isWorking = false;
        this._order = 0;
        this._updateIsNotWorking = [];
        this._config = __assign({ parallels: 1 }, this._config);
        this._memory = new dyna_disk_memory_1.DynaDiskMemory({ diskPath: this._config.diskPath });
        this._callsQueue = new dyna_job_queue_1.DynaJobQueue({ parallels: 1 });
        this._jobsQueue = new dyna_job_queue_1.DynaJobQueue({ parallels: this._config.parallels });
        this._callsQueue.addJobPromised(function () { return _this._initialize(); });
    }
    DynaQueueHandler.prototype._initialize = function () {
        return this._memory.delAll()
            .catch(function (error) {
            return Promise.reject({
                code: 1810261314,
                errorType: dyna_interfaces_1.EErrorType.HW,
                message: 'DynaQueueHandler, error cleaning the previous session',
                error: error,
            });
        });
    };
    DynaQueueHandler.prototype.isNotWorking = function () {
        var _this = this;
        if (!this.isWorking)
            return Promise.resolve();
        return new Promise(function (resolve) {
            _this._updateIsNotWorking.push(resolve);
        });
    };
    DynaQueueHandler.prototype.addJob = function (data, priority) {
        if (priority === void 0) { priority = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this._callsQueue.addJobPromised(function () {
                        return _this._addJob(data, priority);
                    })];
            });
        });
    };
    DynaQueueHandler.prototype._addJob = function (data, priority) {
        if (priority === void 0) { priority = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var jobId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jobId = dyna_guid_1.guid(1);
                        return [4 /*yield*/, this._memory.set('data', jobId, data)];
                    case 1:
                        _a.sent();
                        data = null; // for GC
                        this._jobIndex.jobs.push({ jobId: jobId, priority: priority, order: this._order++ });
                        if (!this._hasDiffPriorities &&
                            this._jobIndex.jobs.length > 1 &&
                            this._jobIndex.jobs[this._jobIndex.jobs.length - 2].priority !== priority) {
                            this._hasDiffPriorities = true;
                        }
                        if (this._hasDiffPriorities)
                            this._sortJobs();
                        this._jobsQueue.addJobCallback(function (done) { return __awaiter(_this, void 0, void 0, function () {
                            var jobItem, data;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        jobItem = this._jobIndex.jobs.shift();
                                        if (this._jobIndex.jobs.length === 0)
                                            this._hasDiffPriorities = false;
                                        return [4 /*yield*/, this._memory.get('data', jobItem.jobId)];
                                    case 1:
                                        data = _a.sent();
                                        this._isWorking = true;
                                        this._config.onJob(data, function () {
                                            _this._memory.del('data', jobItem.jobId)
                                                .catch(function (error) {
                                                console.error("DynaQueueHandler: 1810261313 dyna-disk-memory cannot delete this job id [" + jobItem.jobId + "]\n                This is not a critical error (so far), the app is still running without any problem.\n                This error is occurred when:\n                - There are more than one instances that are using this folder (this is not allowed)\n                - A demon is monitoring and blocking the files (like webpack)\n                - Or, if this happens in production only, the disk has a problem (check the error)", error);
                                            })
                                                .then(function () {
                                                // if no jobs, check if notWorking is called and resolve it/them
                                                if (_this._jobsQueue.stats.jobs === 0) {
                                                    while (_this._updateIsNotWorking.length)
                                                        _this._updateIsNotWorking.shift()();
                                                }
                                            })
                                                .then(function () { return _this._isWorking = false; })
                                                .then(done);
                                        });
                                        data = null; // for GC
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(DynaQueueHandler.prototype, "hasJobs", {
        get: function () {
            return !!this._jobIndex.jobs.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "jobsCount", {
        get: function () {
            return this._jobIndex.jobs.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "isWorking", {
        get: function () {
            return this._isWorking;
        },
        enumerable: true,
        configurable: true
    });
    DynaQueueHandler.prototype._sortJobs = function () {
        var output = [];
        this._jobIndex.jobs = this._jobIndex.jobs.sort(function (jobItemA, jobItemB) { return jobItemA.priority - jobItemB.priority; });
        var jobs = this._jobIndex.jobs.reduce(function (acc, jobItem) {
            if (!acc[jobItem.priority])
                acc[jobItem.priority] = [];
            acc[jobItem.priority].push(jobItem);
            return acc;
        }, {});
        Object.keys(jobs)
            .map(function (priority) { return jobs[priority]; })
            .forEach(function (jobItems) {
            output = output.concat(jobItems.sort(function (jobItemA, jobItemB) { return jobItemA.order - jobItemB.order; }));
        });
        this._jobIndex.jobs = output;
    };
    return DynaQueueHandler;
}());
exports.DynaQueueHandler = DynaQueueHandler;


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

module.exports = require("dyna-interfaces");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("dyna-job-queue");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});