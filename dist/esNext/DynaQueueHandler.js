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
import { guid } from "dyna-guid";
import { EErrorType } from "dyna-interfaces";
import { DynaJobQueue } from "dyna-job-queue";
import { isNode } from "./isNode";
var DynaQueueHandler = /** @class */ (function () {
    function DynaQueueHandler(_config) {
        this._config = _config;
        this._initialized = false;
        this._isWorking = false;
        this._jobIndex = 0;
        this._jobs = [];
        this._debugReady = false;
        this._config = __assign({ parallels: 1 }, this._config);
    }
    DynaQueueHandler.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _DynaDiskMemory, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._initialized)
                            return [2 /*return*/];
                        this._initialized = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        this._queue = new DynaJobQueue({ parallels: this._config.parallels });
                        this.addJob = this._queue.jobFactory(this.addJob.bind(this));
                        this._processQueuedItem = this._queue.jobFactory(this._processQueuedItem.bind(this));
                        _DynaDiskMemory = void 0;
                        if (!isNode) return [3 /*break*/, 3];
                        return [4 /*yield*/, import("dyna-disk-memory/dist/commonJs/node")];
                    case 2:
                        _DynaDiskMemory = (_a.sent()).DynaDiskMemory;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, import("dyna-disk-memory/dist/commonJs/web")];
                    case 4:
                        _DynaDiskMemory = (_a.sent()).DynaDiskMemory;
                        _a.label = 5;
                    case 5:
                        this._memory = new _DynaDiskMemory({ diskPath: this._config.diskPath });
                        return [4 /*yield*/, this._memory.delAll()];
                    case 6:
                        _a.sent();
                        this._debugReady = true;
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        throw {
                            code: 1810261314,
                            errorType: EErrorType.HW,
                            message: 'DynaQueueHandler, error cleaning the previous session',
                            error: error_1,
                        };
                    case 8: return [2 /*return*/];
                }
            });
        });
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
                        if (!this._debugReady)
                            console.error('not ready!!!!');
                        jobId = guid(1);
                        return [4 /*yield*/, this._memory.set('data', jobId, data)];
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
                        _a.trys.push([0, 7, , 8]);
                        this._isWorking = true;
                        jobItem = this._jobs.shift();
                        if (!jobItem) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._memory.get('data', jobItem.jobId)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this._memory.del('data', jobItem.jobId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this._config.onJob(data)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        this._isWorking = false;
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        console.error('DynaQueueHandler _processQueuedItem error', e_2);
                        this._isWorking = false;
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(DynaQueueHandler.prototype, "hasJobs", {
        get: function () {
            return !!this.jobsCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaQueueHandler.prototype, "jobsCount", {
        get: function () {
            return this._jobs.length;
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
export { DynaQueueHandler };
//# sourceMappingURL=DynaQueueHandler.js.map