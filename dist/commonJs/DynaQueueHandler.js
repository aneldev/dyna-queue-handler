"use strict";
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
var DynaQueueHandler = /** @class */ (function () {
    function DynaQueueHandler(_config) {
        this._config = _config;
        this._guidBase = dyna_guid_1.guid();
        this._guidCount = 0;
        this._workingParallels = 0;
        this._jobIndex = 0;
        this._jobs = [];
        this._allDoneCallbacks = [];
        var _a = this._config.autoStart, autoStart = _a === void 0 ? true : _a;
        this._active = autoStart;
    }
    DynaQueueHandler.prototype.start = function () {
        this._active = true;
        this._processQueuedItem();
    };
    DynaQueueHandler.prototype.stop = function () {
        this._active = false;
    };
    DynaQueueHandler.prototype.allDone = function () {
        var _this = this;
        if (!this.isWorking && !this.hasJobs)
            return Promise.resolve();
        return new Promise(function (resolve) { return _this._allDoneCallbacks.push(resolve); });
    };
    DynaQueueHandler.prototype.addJob = function (data, priority, _debug_message) {
        if (priority === void 0) { priority = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var jobId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jobId = this._guid;
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
                        if (this._workingParallels >= this._configParallels)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, 8, 9]);
                        this._workingParallels++;
                        jobItem = this._jobs.shift();
                        if (!jobItem) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._config.memoryGet(jobItem.jobId)];
                    case 2:
                        data = _a.sent();
                        this._config.memoryDel(jobItem.jobId) // Delete this without wait, to improve performance
                            .catch(function (e) { return console.error('DynaQueueHandler: processQueuedItem, cannot memoryDel', e); });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        this._processQueuedItem(); // Run next parallel
                        return [4 /*yield*/, this._config.onJob(data)];
                    case 4:
                        _a.sent(); // Run the current job
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        console.error('DynaQueueHandler: onJob error', e_1);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_2 = _a.sent();
                        console.error('DynaQueueHandler _processQueuedItem error', e_2);
                        return [3 /*break*/, 9];
                    case 8:
                        this._workingParallels--;
                        return [7 /*endfinally*/];
                    case 9:
                        if (this.hasJobs) {
                            this._processQueuedItem();
                        }
                        else if (!this.isWorking) {
                            while (this._allDoneCallbacks.length) {
                                // @ts-ignore
                                this._allDoneCallbacks.shift()();
                            }
                        }
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
    Object.defineProperty(DynaQueueHandler.prototype, "isWorking", {
        get: function () {
            return this._workingParallels > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "hasJobs", {
        get: function () {
            return !!this._jobs.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "jobsCount", {
        get: function () {
            return this._jobs.length + this._workingParallels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "processingJobsCount", {
        get: function () {
            return this._workingParallels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "_configParallels", {
        get: function () {
            return this._config.parallels === undefined
                ? 1
                : this._config.parallels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "_guid", {
        get: function () {
            return this._guidBase + (this._guidCount++);
        },
        enumerable: true,
        configurable: true
    });
    return DynaQueueHandler;
}());
exports.DynaQueueHandler = DynaQueueHandler;
//# sourceMappingURL=DynaQueueHandler.js.map