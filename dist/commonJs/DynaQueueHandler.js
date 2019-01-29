"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var dyna_guid_1 = require("dyna-guid");
var dyna_interfaces_1 = require("dyna-interfaces");
var dyna_job_queue_1 = require("dyna-job-queue");
var isNode_1 = require("./isNode");
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
        this._callsQueue = new dyna_job_queue_1.DynaJobQueue({ parallels: 1 });
        this._jobsQueue = new dyna_job_queue_1.DynaJobQueue({ parallels: this._config.parallels });
        this._callsQueue.addJobPromised(function () { return _this._initialize(); });
    }
    DynaQueueHandler.prototype._initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _DynaDiskMemory, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        _DynaDiskMemory = void 0;
                        if (!isNode_1.isNode) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("dyna-disk-memory/dist/commonJs/node"); })];
                    case 1:
                        _DynaDiskMemory = (_a.sent()).DynaDiskMemory;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, Promise.resolve().then(function () { return require("dyna-disk-memory/dist/commonJs/web"); })];
                    case 3:
                        _DynaDiskMemory = (_a.sent()).DynaDiskMemory;
                        _a.label = 4;
                    case 4:
                        this._memory = new _DynaDiskMemory({ diskPath: this._config.diskPath });
                        return [4 /*yield*/, this._memory.delAll()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject({
                                code: 1810261314,
                                errorType: dyna_interfaces_1.EErrorType.HW,
                                message: 'DynaQueueHandler, error cleaning the previous session',
                                error: error_1,
                            })];
                    case 7: return [2 /*return*/];
                }
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
                                        if (!jobItem) { // this is not possible, is only for TS
                                            done();
                                            return [2 /*return*/];
                                        }
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
                                                    while (_this._updateIsNotWorking.length) {
                                                        // @ts-ignore
                                                        _this._updateIsNotWorking.shift()();
                                                    }
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
//# sourceMappingURL=DynaQueueHandler.js.map