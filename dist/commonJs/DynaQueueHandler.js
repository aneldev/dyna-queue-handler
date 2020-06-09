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
var commonJs_1 = require("dyna-job-queue/dist/commonJs");
var DynaQueueHandler = /** @class */ (function () {
    function DynaQueueHandler(_config) {
        this._config = _config;
        this._initialized = false;
        this._isWorking = false;
        this._jobIndex = 0;
        this._jobs = [];
        this._config = __assign({ parallels: 1 }, this._config);
        this._active = this._config.autoStart === undefined
            ? true
            : this._config.autoStart;
    }
    DynaQueueHandler.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._initialized)
                            return [2 /*return*/];
                        this._initialized = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this._queue = new commonJs_1.DynaJobQueue({ parallels: this._config.parallels });
                        this.addJob = this._queue.jobFactory(this.addJob.bind(this));
                        this._processQueuedItem = this._queue.jobFactory(this._processQueuedItem.bind(this)); // This is only for the 1st calls synchronization with the init
                        return [4 /*yield*/, this._config.memoryDelAll()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw {
                            code: 1810261314,
                            errorType: dyna_interfaces_1.EErrorType.HW,
                            message: 'DynaQueueHandler, error cleaning the previous session',
                            error: error_1,
                        };
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynaQueueHandler.prototype.start = function () {
        this._active = true;
        this._processQueuedItem();
    };
    DynaQueueHandler.prototype.stop = function () {
        this._active = false;
    };
    DynaQueueHandler.prototype.isNotWorking = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.isWorking)
                    return [2 /*return*/];
                return [2 /*return*/, this._queue.addJobPromised(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!this.isWorking)
                                return [2 /*return*/];
                            else
                                throw {};
                            return [2 /*return*/];
                        });
                    }); })
                        .catch(function () { return _this.isNotWorking(); })];
            });
        });
    };
    DynaQueueHandler.prototype.addJob = function (data, priority) {
        if (priority === void 0) { priority = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var errorMessage, jobId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._initialized) {
                            errorMessage = 'DynaQueueHandler is not initialized! Call `.init()` where is `:Promise<void>` before any call.';
                            console.error(errorMessage);
                            throw { message: errorMessage };
                        }
                        jobId = dyna_guid_1.guid(1);
                        return [4 /*yield*/, this._config.memorySet(jobId, data)];
                    case 1:
                        _a.sent();
                        this._jobs.push({
                            index: (priority * 10000000) + (++this._jobIndex),
                            jobId: jobId,
                        });
                        this._jobs = this._jobs.sort(function (a, b) { return a.index - b.index; });
                        this._processQueuedItem();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynaQueueHandler.prototype._processQueuedItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jobItem, data, e_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._active)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        this._isWorking = true;
                        jobItem = this._jobs.shift();
                        if (!jobItem) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._config.memoryGet(jobItem.jobId)];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, this._config.memoryDel(jobItem.jobId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this._config.onJob(data)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        this._isWorking = false;
                        return [3 /*break*/, 9];
                    case 8:
                        e_2 = _a.sent();
                        console.error('DynaQueueHandler _processQueuedItem error', e_2);
                        this._isWorking = false;
                        return [3 /*break*/, 9];
                    case 9:
                        if (this.hasJobs)
                            this._processQueuedItem();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(DynaQueueHandler.prototype, "jobs", {
        get: function () {
            var _this = this;
            return Promise.all(this._jobs.map(function (jobItem) { return _this._config.memoryGet(jobItem.jobId); }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "hasJobs", {
        get: function () {
            return !!this.jobsCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "jobsCount", {
        get: function () {
            return this._jobs.length + (this._isWorking ? this._queue.stats.running : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "processingJobsCount", {
        get: function () {
            return this._queue.stats.running;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "isWorking", {
        get: function () {
            return this.hasJobs || this._isWorking;
        },
        enumerable: true,
        configurable: true
    });
    return DynaQueueHandler;
}());
exports.DynaQueueHandler = DynaQueueHandler;
//# sourceMappingURL=DynaQueueHandler.js.map