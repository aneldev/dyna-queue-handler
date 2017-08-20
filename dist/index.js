(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("child_process"), require("fs"), require("path"), require("events"));
	else if(typeof define === 'function' && define.amd)
		define("dyna-queue-handler", ["child_process", "fs", "path", "events"], factory);
	else if(typeof exports === 'object')
		exports["dyna-queue-handler"] = factory(require("child_process"), require("fs"), require("path"), require("events"));
	else
		root["dyna-queue-handler"] = factory(root["child_process"], root["fs"], root["path"], root["events"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_9__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DynaQueueHanlder_1 = __webpack_require__(5);
exports.DynaQueueHandler = DynaQueueHanlder_1.DynaQueueHandler;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = __webpack_require__(9);
const dyna_disk_memory_1 = __webpack_require__(6);
const dyna_job_queue_1 = __webpack_require__(8);
const dyna_guid_1 = __webpack_require__(7);
class DynaQueueHandler extends EventEmitter {
    constructor(settings) {
        super();
        this._internalJobQueue = new dyna_job_queue_1.DynaJobQueue();
        this._onJobIsWorking = {};
        this._settings = Object.assign({}, settings);
        this._memory = new dyna_disk_memory_1.DynaDiskMemory({ diskPath: this._settings.diskPath });
    }
    addJob(data, priority = 1, group = '__defaultGroup') {
        return this._internalJobQueue.addJobPromise((resolve, reject) => {
            this._addJob(data, priority, group).then(resolve).catch(reject);
        }, 1); // internal job queue priority 1
    }
    _addJob(data, priority = 1, group = '__defaultGroup') {
        return __awaiter(this, void 0, void 0, function* () {
            const job = {
                id: dyna_guid_1.guid(1),
                arrived: new Date(),
                group,
                priority,
                data,
                nextJobId: null,
            };
            // get the container handler (if exists)
            let containerHandler = yield this._memory.get(group, 'handler');
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
            // update the current last pushed job, that the next of it is this one
            if (containerHandler[priority].lastJobId) {
                let lastJob = yield this._memory.get(group, containerHandler[priority].lastJobId);
                if (lastJob) {
                    lastJob.nextJobId = job.id;
                    yield this._memory.set(group, lastJob.id, lastJob);
                }
                else {
                    // This is the case where the lastJob file doesn't exist on the disk for any reason!
                    // This might happen because of disk error or the file deletes by someone else (factor or user).
                    // As fallback, we reset the container handler in order to continue and work.
                    console.error(`DynaQueueHandler: pushJob: The last pushed job with id ${containerHandler[priority].lastJobId} cannot be found on disk! This is probably disk error. ${containerHandler[priority].jobsCount} jobs lost as cannot be tracked. If you see this message often check your disk.`);
                    // reset the container handler
                    containerHandler[priority].nextJobId = job.id;
                    containerHandler[priority].lastJobId = job.id;
                    containerHandler[priority].jobsCount = 0;
                }
            }
            else {
                containerHandler[priority].nextJobId = job.id;
            }
            // save the new job
            yield this._memory.set(group, job.id, job);
            // update the container handler and save it
            containerHandler[priority].lastJobId = job.id;
            containerHandler[priority].jobsCount++;
            yield this._memory.set(group, 'handler', containerHandler);
            this._callJobListener(group);
            return job;
        });
    }
    // get a view, the number of pending jobs of a group, at this time
    viewJobs(group = '__defaultGroup') {
        return this._internalJobQueue.addJobPromise((resolve, reject) => {
            this._viewJobs(group).then(resolve).catch(reject);
        }, 0);
    }
    _viewJobs(group = '__defaultGroup') {
        return new Promise((resolve, reject) => {
            this._memory.get(group, 'handler')
                .then((groupHandler) => {
                let view = {
                    items: [],
                    hasJobs: false,
                };
                if (groupHandler) {
                    Object.keys(groupHandler).forEach((priority) => {
                        let jobsCount = groupHandler[Number(priority)].jobsCount;
                        view.items.push({
                            priority: Number(priority),
                            count: jobsCount, lastJobId: groupHandler[Number(priority)].lastJobId,
                            nextJobId: groupHandler[Number(priority)].nextJobId,
                        });
                        if (!!jobsCount)
                            view.hasJobs = true;
                    });
                    view.items.sort((a, b) => a.priority - b.priority);
                }
                resolve(view);
            })
                .catch(reject);
        });
    }
    pickJob(priority = undefined, group = '__defaultGroup') {
        return this._internalJobQueue.addJobPromise((resolve, reject) => {
            this._pickJob(priority, group).then(resolve).catch(reject);
        }, 0); // internal job queue priority 0
    }
    _pickJob(priority = undefined, group = '__defaultGroup') {
        return __awaiter(this, void 0, void 0, function* () {
            if (priority === undefined) {
                const view = yield this._viewJobs(group); // call the private version that doesn't use the job queue!
                const groupJobViewItem = view.items
                    .filter((item) => !!item.count)[0];
                priority = groupJobViewItem && groupJobViewItem.priority;
                if (priority === undefined)
                    return undefined;
            }
            let groupHandler = yield this._memory.get(group, 'handler');
            let nextJobId = groupHandler && groupHandler[priority] && groupHandler[priority].nextJobId;
            let job = nextJobId && (yield this._memory.get(group, nextJobId));
            if (job) {
                groupHandler[priority].nextJobId = job.nextJobId; // job.nextJobId might be null, this is normal because this is the last one
                groupHandler[priority].jobsCount -= 1;
                if (groupHandler[priority].jobsCount == 0)
                    groupHandler[priority].lastJobId = null;
                yield this._memory.set(group, 'handler', groupHandler);
                yield this._memory.del(group, job.id);
            }
            return job || undefined;
        });
    }
    on(eventName, listener) {
        EventEmitter.prototype.on.call(this, eventName, listener);
        if (typeof eventName == 'string') {
            if (eventName.substr(0, 3) == 'job') {
                const group = eventName.substr(4) || '__defaultGroup';
                this._callJobListener(group);
            }
        }
        return this;
    }
    _callJobListener(forGroup) {
        // automatically adds this in internal job queue
        return this._internalJobQueue.addJobPromise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const eventName = forGroup === '__defaultGroup' ? 'job' : `job/${forGroup}`;
            if (this.listenerCount(eventName) && !this._onJobIsWorking[eventName]) {
                const job = yield this._pickJob(undefined, forGroup);
                if (job) {
                    this._onJobIsWorking[eventName] = true;
                    this.emit(eventName, job, () => {
                        this._onJobIsWorking[eventName] = false;
                        this._callJobListener(forGroup); // check again for this group
                    });
                }
            }
            resolve(undefined);
        }), 0);
    }
    delGroup(group) {
        return this._memory.delContainer(group);
    }
    delAll() {
        return this._memory.delAll();
    }
    get isWorking() {
        return this._internalJobQueue.isWorking;
    }
}
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function webpackUniversalModuleDefinition(root, factory) {
    if (( false ? 'undefined' : _typeof2(exports)) === 'object' && ( false ? 'undefined' : _typeof2(module)) === 'object') module.exports = factory(__webpack_require__(1), __webpack_require__(2), __webpack_require__(3));else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object') exports["dyna-disk-memory"] = factory(require("child_process"), require("fs"), require("path"));else root["dyna-disk-memory"] = factory(root["child_process"], root["fs"], root["path"]);
})(undefined, function (__WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
    return (/******/function (modules) {
            // webpackBootstrap
            /******/ // The module cache
            /******/var installedModules = {};
            /******/
            /******/ // The require function
            /******/function __webpack_require__(moduleId) {
                /******/
                /******/ // Check if module is in cache
                /******/if (installedModules[moduleId]) {
                    /******/return installedModules[moduleId].exports;
                    /******/
                }
                /******/ // Create a new module (and put it into the cache)
                /******/var module = installedModules[moduleId] = {
                    /******/i: moduleId,
                    /******/l: false,
                    /******/exports: {}
                    /******/ };
                /******/
                /******/ // Execute the module function
                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/ // Flag the module as loaded
                /******/module.l = true;
                /******/
                /******/ // Return the exports of the module
                /******/return module.exports;
                /******/
            }
            /******/
            /******/
            /******/ // expose the modules object (__webpack_modules__)
            /******/__webpack_require__.m = modules;
            /******/
            /******/ // expose the module cache
            /******/__webpack_require__.c = installedModules;
            /******/
            /******/ // identity function for calling harmony imports with the correct context
            /******/__webpack_require__.i = function (value) {
                return value;
            };
            /******/
            /******/ // define getter function for harmony exports
            /******/__webpack_require__.d = function (exports, name, getter) {
                /******/if (!__webpack_require__.o(exports, name)) {
                    /******/Object.defineProperty(exports, name, {
                        /******/configurable: false,
                        /******/enumerable: true,
                        /******/get: getter
                        /******/ });
                    /******/
                }
                /******/
            };
            /******/
            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/__webpack_require__.n = function (module) {
                /******/var getter = module && module.__esModule ?
                /******/function getDefault() {
                    return module['default'];
                } :
                /******/function getModuleExports() {
                    return module;
                };
                /******/__webpack_require__.d(getter, 'a', getter);
                /******/return getter;
                /******/
            };
            /******/
            /******/ // Object.prototype.hasOwnProperty.call
            /******/__webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            };
            /******/
            /******/ // __webpack_public_path__
            /******/__webpack_require__.p = "/dist/";
            /******/
            /******/ // Load entry module and return exports
            /******/return __webpack_require__(__webpack_require__.s = 9);
            /******/
        }(
        /************************************************************************/
        /******/[
        /* 0 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var DynaDiskMemoryUniversal_1 = __webpack_require__(3);
            exports.DynaDiskMemory = DynaDiskMemoryUniversal_1.DynaDiskMemoryUniversal;

            /***/
        },
        /* 1 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });

            var DynaDiskMemoryForBrowser = function () {
                function DynaDiskMemoryForBrowser(settings) {
                    _classCallCheck(this, DynaDiskMemoryForBrowser);

                    this._test_performDiskDelay = 0;
                    this._settings = Object.assign({ fragmentSize: 13 }, settings);
                    if (settings.diskPath[settings.diskPath.length - 1] !== '/') this._settings.diskPath += '/';
                }

                _createClass(DynaDiskMemoryForBrowser, [{
                    key: 'set',
                    value: function set(container, key, data) {
                        var _this = this;

                        return new Promise(function (resolve, reject) {
                            var names = _this._generateFilename(container, key);
                            localStorage.setItem(names.full, JSON.stringify(data));
                            setTimeout(resolve, _this._test_performDiskDelay);
                        });
                    }
                }, {
                    key: 'get',
                    value: function get(container, key) {
                        var _this2 = this;

                        return new Promise(function (resolve, reject) {
                            var names = _this2._generateFilename(container, key);
                            var data = JSON.parse(localStorage.getItem(names.full));
                            setTimeout(resolve, _this2._test_performDiskDelay, data);
                        });
                    }
                }, {
                    key: 'del',
                    value: function del(container, key) {
                        var _this3 = this;

                        return new Promise(function (resolve, reject) {
                            var names = _this3._generateFilename(container, key);
                            localStorage.removeItem(names.full);
                            setTimeout(resolve, _this3._test_performDiskDelay);
                        });
                    }
                }, {
                    key: 'delContainer',
                    value: function delContainer(container) {
                        var _this4 = this;

                        return new Promise(function (resolve, reject) {
                            var names = _this4._generateFilename(container);
                            Object.keys(localStorage).filter(function (key) {
                                return key.startsWith(names.folder + '/');
                            }).forEach(function (key) {
                                return localStorage.removeItem(key);
                            });
                            setTimeout(resolve, _this4._test_performDiskDelay);
                        });
                    }
                }, {
                    key: 'delAll',
                    value: function delAll() {
                        var _this5 = this;

                        return new Promise(function (resolve, reject) {
                            var names = _this5._generateFilename();
                            Object.keys(localStorage).filter(function (key) {
                                return key.startsWith(names.base + '/');
                            }).forEach(function (key) {
                                return localStorage.removeItem(key);
                            });
                            setTimeout(resolve, _this5._test_performDiskDelay);
                        });
                    }
                }, {
                    key: '_generateFilename',
                    value: function _generateFilename() {
                        var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '---';
                        var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '---';

                        var full = 'dyna-disk-memory/' + this._settings.diskPath + container + '/' + key;
                        var base = full.substr(0, full.indexOf('/'));
                        var folder = full.substr(0, full.lastIndexOf('/'));
                        var file = full.substr(full.lastIndexOf('/') + 1);
                        return { full: full, base: base, folder: folder, file: file };
                    }
                }]);

                return DynaDiskMemoryForBrowser;
            }();

            exports.DynaDiskMemoryForBrowser = DynaDiskMemoryForBrowser;

            /***/
        },
        /* 2 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var fs = __webpack_require__(7);
            var path = __webpack_require__(8);
            var exec = __webpack_require__(6).exec;

            var DynaDiskMemoryForNode = function () {
                function DynaDiskMemoryForNode(settings) {
                    _classCallCheck(this, DynaDiskMemoryForNode);

                    this._test_performDiskDelay = 0;
                    this._settings = Object.assign({ fragmentSize: 13 }, settings);
                    if (settings.diskPath[settings.diskPath.length - 1] !== '/') this._settings.diskPath += '/';
                }

                _createClass(DynaDiskMemoryForNode, [{
                    key: 'set',
                    value: function set(container, key, data) {
                        return this._saveFile(container, key, data);
                    }
                }, {
                    key: 'get',
                    value: function get(container, key) {
                        return this._loadFile(container, key);
                    }
                }, {
                    key: 'del',
                    value: function del(container, key) {
                        var _this6 = this;

                        return new Promise(function (resolve, reject) {
                            var fileName = _this6._generateFilename(container, key).full;
                            fs.exists(fileName, function (exists) {
                                if (exists) {
                                    fs.unlink(fileName, function (err) {
                                        err && reject(err) || resolve();
                                    });
                                } else {
                                    reject({ errorMessage: 'DynaDiskMemory: del: cannot find to del file for container [' + container + '] and key [' + key + ']', fileName: fileName });
                                }
                            });
                        });
                    }
                }, {
                    key: 'delContainer',
                    value: function delContainer(container) {
                        var _this7 = this;

                        return new Promise(function (resolve, reject) {
                            _this7._rmdir('' + _this7._settings.diskPath + container, function (error) {
                                error && reject(error) || resolve();
                            });
                        });
                    }
                }, {
                    key: 'delAll',
                    value: function delAll() {
                        var _this8 = this;

                        return new Promise(function (resolve, reject) {
                            _this8._rmdir(_this8._settings.diskPath, function (error) {
                                error && reject(error) || resolve();
                            });
                        });
                    }
                }, {
                    key: '_saveFile',
                    value: function _saveFile(container, key, data) {
                        var _this9 = this;

                        return new Promise(function (resolve, reject) {
                            var fileNames = _this9._generateFilename(container, key);
                            _this9._createDirectory(fileNames.folder).then(function () {
                                _this9._writeFileOnDisk(fileNames.folder, fileNames.file, data).then(function () {
                                    return resolve();
                                }).catch(reject);
                            }).catch(reject);
                        });
                    }
                }, {
                    key: '_loadFile',
                    value: function _loadFile(container, key) {
                        var _this10 = this;

                        return new Promise(function (resolve, reject) {
                            var fileNames = _this10._generateFilename(container, key);
                            _this10._readFileFromDisk(fileNames.folder, fileNames.file).then(function (data) {
                                return resolve(data);
                            }).catch(function (error) {
                                return resolve(undefined);
                            });
                        });
                    }
                }, {
                    key: '_createDirectory',
                    value: function _createDirectory(directory) {
                        // todo: make this async
                        return new Promise(function (resolve, reject) {
                            try {
                                var sep = '/'; //path.sep;
                                var initDir = path.isAbsolute(directory) ? sep : '';
                                directory.split(sep).reduce(function (parentDir, childDir) {
                                    var curDir = path.resolve(parentDir, childDir);
                                    if (!fs.existsSync(curDir)) fs.mkdirSync(curDir);
                                    return curDir;
                                }, initDir);
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }
                }, {
                    key: '_writeFileOnDisk',
                    value: function _writeFileOnDisk(folder, fileName, data) {
                        var _this11 = this;

                        return new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                fs.writeFile(folder + '/' + fileName, JSON.stringify(data), function (err) {
                                    if (err) reject({ errorMessage: 'Cannot write file [' + folder + '/' + fileName + ']', error: err });else resolve();
                                });
                            }, _this11._test_performDiskDelay);
                        });
                    }
                }, {
                    key: '_readFileFromDisk',
                    value: function _readFileFromDisk(folder, fileName) {
                        var _this12 = this;

                        return new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                var fullFileName = folder + '/' + fileName;
                                fs.exists(fullFileName, function (exists) {
                                    if (exists) {
                                        fs.readFile(fullFileName, 'utf8', function (err, data) {
                                            if (err) reject({ errorMessage: 'Cannot read file [' + fullFileName + ']', error: err });else resolve(JSON.parse(data));
                                        });
                                    } else {
                                        reject({ errorMessage: 'DynaDiskMemory: _readFileFromDisk: cannot find to read file for folder [' + folder + '] and fileName [' + fileName + ']', fullFileName: fullFileName });
                                    }
                                });
                            }, _this12._test_performDiskDelay);
                        });
                    }
                }, {
                    key: '_generateFilename',
                    value: function _generateFilename(container, key) {
                        var generatedContainer = this._getAsciiCodeHash(container);
                        var generatedKey = this._splitText(this._getAsciiCodeHash(key), this._settings.fragmentSize, '/');
                        var full = '' + this._settings.diskPath + generatedContainer + '/' + generatedKey;
                        var folder = full.substr(0, full.lastIndexOf('/'));
                        var file = full.substr(full.lastIndexOf('/') + 1);
                        return { full: full, folder: folder, file: file };
                    }
                }, {
                    key: '_getAsciiCodeHash',
                    value: function _getAsciiCodeHash(key) {
                        return key.split('').map(function (c) {
                            return c.charCodeAt(0);
                        }).join('_');
                    }
                }, {
                    key: '_splitText',
                    value: function _splitText(text, step, separetor) {
                        var output = "";
                        var se = text.split('').reverse();
                        while (se.length) {
                            output += se.splice(0, step).join('') + separetor;
                        }if (output[output.length - 1] == separetor) output += '_fc';
                        return output;
                    }
                }, {
                    key: '_rmdir',
                    value: function _rmdir(file, cb) {
                        exec('rm -rf ' + file, function (err, stdout, stderr) {
                            cb(err);
                        });
                    }
                }]);

                return DynaDiskMemoryForNode;
            }();

            exports.DynaDiskMemoryForNode = DynaDiskMemoryForNode;

            /***/
        },
        /* 3 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var dyna_universal_1 = __webpack_require__(4);
            var DynaDiskMemoryForBrowser_1 = __webpack_require__(1);
            var DynaDiskMemoryForNode_1 = __webpack_require__(2);

            var DynaDiskMemoryUniversal = function () {
                function DynaDiskMemoryUniversal(settings) {
                    _classCallCheck(this, DynaDiskMemoryUniversal);

                    this._test_performDiskDelay = 0;
                    this._settings = Object.assign({ fragmentSize: 13, _test_workForBrowser: false, _test_performDiskDelay: 0 }, settings);
                    if (settings.diskPath[settings.diskPath.length - 1] !== '/') this._settings.diskPath += '/';
                    if (this._settings._test_workForBrowser) this._memory = new DynaDiskMemoryForBrowser_1.DynaDiskMemoryForBrowser(this._settings);else if (dyna_universal_1.isNode()) this._memory = new DynaDiskMemoryForNode_1.DynaDiskMemoryForNode(this._settings);else this._memory = new DynaDiskMemoryForBrowser_1.DynaDiskMemoryForBrowser(this._settings);
                    this._memory._test_performDiskDelay = this._test_performDiskDelay;
                }

                _createClass(DynaDiskMemoryUniversal, [{
                    key: 'set',
                    value: function set(container, key, data) {
                        return this._memory.set(container, key, data);
                    }
                }, {
                    key: 'get',
                    value: function get(container, key) {
                        return this._memory.get(container, key);
                    }
                }, {
                    key: 'del',
                    value: function del(container, key) {
                        return this._memory.del(container, key);
                    }
                }, {
                    key: 'delContainer',
                    value: function delContainer(container) {
                        return this._memory.delContainer(container);
                    }
                }, {
                    key: 'delAll',
                    value: function delAll() {
                        return this._memory.delAll();
                    }
                }]);

                return DynaDiskMemoryUniversal;
            }();

            exports.DynaDiskMemoryUniversal = DynaDiskMemoryUniversal;

            /***/
        },
        /* 4 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* WEBPACK VAR INJECTION */
            (function (module) {
                var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

                var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
                    return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
                } : function (obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
                };

                (function webpackUniversalModuleDefinition(root, factory) {
                    if ((false ? 'undefined' : _typeof(exports)) === 'object' && (false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["dyna-universal"] = factory();else root["dyna-universal"] = factory();
                })(undefined, function () {
                    return (/******/function (modules) {
                            // webpackBootstrap
                            /******/ // The module cache
                            /******/var installedModules = {};
                            /******/
                            /******/ // The require function
                            /******/function __webpack_require__(moduleId) {
                                /******/
                                /******/ // Check if module is in cache
                                /******/if (installedModules[moduleId]) {
                                    /******/return installedModules[moduleId].exports;
                                    /******/
                                }
                                /******/ // Create a new module (and put it into the cache)
                                /******/var module = installedModules[moduleId] = {
                                    /******/i: moduleId,
                                    /******/l: false,
                                    /******/exports: {}
                                    /******/ };
                                /******/
                                /******/ // Execute the module function
                                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                                /******/
                                /******/ // Flag the module as loaded
                                /******/module.l = true;
                                /******/
                                /******/ // Return the exports of the module
                                /******/return module.exports;
                                /******/
                            }
                            /******/
                            /******/
                            /******/ // expose the modules object (__webpack_modules__)
                            /******/__webpack_require__.m = modules;
                            /******/
                            /******/ // expose the module cache
                            /******/__webpack_require__.c = installedModules;
                            /******/
                            /******/ // identity function for calling harmony imports with the correct context
                            /******/__webpack_require__.i = function (value) {
                                return value;
                            };
                            /******/
                            /******/ // define getter function for harmony exports
                            /******/__webpack_require__.d = function (exports, name, getter) {
                                /******/if (!__webpack_require__.o(exports, name)) {
                                    /******/Object.defineProperty(exports, name, {
                                        /******/configurable: false,
                                        /******/enumerable: true,
                                        /******/get: getter
                                        /******/ });
                                    /******/
                                }
                                /******/
                            };
                            /******/
                            /******/ // getDefaultExport function for compatibility with non-harmony modules
                            /******/__webpack_require__.n = function (module) {
                                /******/var getter = module && module.__esModule ?
                                /******/function getDefault() {
                                    return module['default'];
                                } :
                                /******/function getModuleExports() {
                                    return module;
                                };
                                /******/__webpack_require__.d(getter, 'a', getter);
                                /******/return getter;
                                /******/
                            };
                            /******/
                            /******/ // Object.prototype.hasOwnProperty.call
                            /******/__webpack_require__.o = function (object, property) {
                                return Object.prototype.hasOwnProperty.call(object, property);
                            };
                            /******/
                            /******/ // __webpack_public_path__
                            /******/__webpack_require__.p = "/dist/";
                            /******/
                            /******/ // Load entry module and return exports
                            /******/return __webpack_require__(__webpack_require__.s = 1);
                            /******/
                        }(
                        /************************************************************************/
                        /******/[
                        /* 0 */
                        /***/function (module, exports, __webpack_require__) {

                            "use strict";

                            Object.defineProperty(exports, "__esModule", { value: true });
                            exports.isNode = function () {
                                return !!(typeof process !== 'undefined' && process.versions && process.versions.node);
                            };
                            exports.isBrowser = function () {
                                return !exports.isNode();
                            };

                            /***/
                        },
                        /* 1 */
                        /***/function (module, exports, __webpack_require__) {

                            module.exports = __webpack_require__(0);

                            /***/
                        }]
                        /******/)
                    );
                });
                /* WEBPACK VAR INJECTION */
            }).call(exports, __webpack_require__(5)(module));

            /***/
        },
        /* 5 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            module.exports = function (module) {
                if (!module.webpackPolyfill) {
                    module.deprecate = function () {};
                    module.paths = [];
                    // module.parent = undefined by default
                    if (!module.children) module.children = [];
                    Object.defineProperty(module, "loaded", {
                        enumerable: true,
                        get: function get() {
                            return module.l;
                        }
                    });
                    Object.defineProperty(module, "id", {
                        enumerable: true,
                        get: function get() {
                            return module.i;
                        }
                    });
                    module.webpackPolyfill = 1;
                }
                return module;
            };

            /***/
        },
        /* 6 */
        /***/function (module, exports) {

            module.exports = __webpack_require__(1);

            /***/
        },
        /* 7 */
        /***/function (module, exports) {

            module.exports = __webpack_require__(2);

            /***/
        },
        /* 8 */
        /***/function (module, exports) {

            module.exports = __webpack_require__(3);

            /***/
        },
        /* 9 */
        /***/function (module, exports, __webpack_require__) {

            module.exports = __webpack_require__(0);

            /***/
        }]
        /******/)
    );
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
    if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["dyna-guid"] = factory();else root["dyna-guid"] = factory();
})(undefined, function () {
    return (/******/function (modules) {
            // webpackBootstrap
            /******/ // The module cache
            /******/var installedModules = {};
            /******/
            /******/ // The require function
            /******/function __webpack_require__(moduleId) {
                /******/
                /******/ // Check if module is in cache
                /******/if (installedModules[moduleId]) {
                    /******/return installedModules[moduleId].exports;
                    /******/
                }
                /******/ // Create a new module (and put it into the cache)
                /******/var module = installedModules[moduleId] = {
                    /******/i: moduleId,
                    /******/l: false,
                    /******/exports: {}
                    /******/ };
                /******/
                /******/ // Execute the module function
                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/ // Flag the module as loaded
                /******/module.l = true;
                /******/
                /******/ // Return the exports of the module
                /******/return module.exports;
                /******/
            }
            /******/
            /******/
            /******/ // expose the modules object (__webpack_modules__)
            /******/__webpack_require__.m = modules;
            /******/
            /******/ // expose the module cache
            /******/__webpack_require__.c = installedModules;
            /******/
            /******/ // identity function for calling harmony imports with the correct context
            /******/__webpack_require__.i = function (value) {
                return value;
            };
            /******/
            /******/ // define getter function for harmony exports
            /******/__webpack_require__.d = function (exports, name, getter) {
                /******/if (!__webpack_require__.o(exports, name)) {
                    /******/Object.defineProperty(exports, name, {
                        /******/configurable: false,
                        /******/enumerable: true,
                        /******/get: getter
                        /******/ });
                    /******/
                }
                /******/
            };
            /******/
            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/__webpack_require__.n = function (module) {
                /******/var getter = module && module.__esModule ?
                /******/function getDefault() {
                    return module['default'];
                } :
                /******/function getModuleExports() {
                    return module;
                };
                /******/__webpack_require__.d(getter, 'a', getter);
                /******/return getter;
                /******/
            };
            /******/
            /******/ // Object.prototype.hasOwnProperty.call
            /******/__webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            };
            /******/
            /******/ // __webpack_public_path__
            /******/__webpack_require__.p = "/dist/";
            /******/
            /******/ // Load entry module and return exports
            /******/return __webpack_require__(__webpack_require__.s = 1);
            /******/
        }(
        /************************************************************************/
        /******/[
        /* 0 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var random = function random() {
                return Math.floor(1000000000 + Math.random() * 0x10000000 /* 65536 */).toString(18).substr(0, 8);
            };
            exports.guid = function () {
                var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

                var date = new Date();
                var datePart = (Number(date) * 3).toString().split("").reverse().join("");
                var timeZonePart = new Date().getTimezoneOffset();
                if (timeZonePart < 0) {
                    timeZonePart = -timeZonePart;
                    timeZonePart = '7' + timeZonePart;
                } else {
                    timeZonePart = '3' + timeZonePart;
                }
                var output = '';
                for (var i = 0; i < blocks; i++) {
                    output += random() + '-';
                }output += datePart;
                output += timeZonePart;
                return output;
            };

            /***/
        },
        /* 1 */
        /***/function (module, exports, __webpack_require__) {

            module.exports = __webpack_require__(0);

            /***/
        }]
        /******/)
    );
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function webpackUniversalModuleDefinition(root, factory) {
    if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["dyna-job-queue"] = factory();else root["dyna-job-queue"] = factory();
})(undefined, function () {
    return (/******/function (modules) {
            // webpackBootstrap
            /******/ // The module cache
            /******/var installedModules = {};
            /******/
            /******/ // The require function
            /******/function __webpack_require__(moduleId) {
                /******/
                /******/ // Check if module is in cache
                /******/if (installedModules[moduleId]) {
                    /******/return installedModules[moduleId].exports;
                    /******/
                }
                /******/ // Create a new module (and put it into the cache)
                /******/var module = installedModules[moduleId] = {
                    /******/i: moduleId,
                    /******/l: false,
                    /******/exports: {}
                    /******/ };
                /******/
                /******/ // Execute the module function
                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/ // Flag the module as loaded
                /******/module.l = true;
                /******/
                /******/ // Return the exports of the module
                /******/return module.exports;
                /******/
            }
            /******/
            /******/
            /******/ // expose the modules object (__webpack_modules__)
            /******/__webpack_require__.m = modules;
            /******/
            /******/ // expose the module cache
            /******/__webpack_require__.c = installedModules;
            /******/
            /******/ // identity function for calling harmony imports with the correct context
            /******/__webpack_require__.i = function (value) {
                return value;
            };
            /******/
            /******/ // define getter function for harmony exports
            /******/__webpack_require__.d = function (exports, name, getter) {
                /******/if (!__webpack_require__.o(exports, name)) {
                    /******/Object.defineProperty(exports, name, {
                        /******/configurable: false,
                        /******/enumerable: true,
                        /******/get: getter
                        /******/ });
                    /******/
                }
                /******/
            };
            /******/
            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/__webpack_require__.n = function (module) {
                /******/var getter = module && module.__esModule ?
                /******/function getDefault() {
                    return module['default'];
                } :
                /******/function getModuleExports() {
                    return module;
                };
                /******/__webpack_require__.d(getter, 'a', getter);
                /******/return getter;
                /******/
            };
            /******/
            /******/ // Object.prototype.hasOwnProperty.call
            /******/__webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            };
            /******/
            /******/ // __webpack_public_path__
            /******/__webpack_require__.p = "/dist/";
            /******/
            /******/ // Load entry module and return exports
            /******/return __webpack_require__(__webpack_require__.s = 1);
            /******/
        }(
        /************************************************************************/
        /******/[
        /* 0 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });

            var DynaJobQueue = function () {
                function DynaJobQueue() {
                    _classCallCheck(this, DynaJobQueue);

                    this._jobs = [];
                    this._isExecuting = false;
                    this._internalCounter = 0;
                }

                _createClass(DynaJobQueue, [{
                    key: 'addJob',
                    value: function addJob(command, data) {
                        var _this = this;

                        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
                        var _callback = arguments[3];

                        if (!_callback) _callback = this.onJob;
                        var job = { command: command, data: data, priority: priority, _internalPriority: this._createPriorityNumber(priority), _callback: _callback };
                        this._jobs.push(job);
                        this._jobs.sort(function (jobA, jobB) {
                            return jobA._internalPriority - jobB._internalPriority;
                        });
                        setTimeout(function () {
                            return _this._execute();
                        }, 0);
                        return job;
                    }
                }, {
                    key: 'addJobCallback',
                    value: function addJobCallback(callback) {
                        var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                        return this.addJob(null, null, priority, callback);
                    }
                }, {
                    key: 'addJobPromise',
                    value: function addJobPromise(callback) {
                        var _this2 = this;

                        var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                        return new Promise(function (resolve, reject) {
                            _this2.addJobCallback(function (done) {
                                return callback(function (data) {
                                    resolve(data);
                                    done();
                                }, function (error) {
                                    reject(error);
                                    done();
                                });
                            }, priority);
                        });
                    }
                }, {
                    key: 'onJob',
                    value: function onJob(job, done) {
                        // to override!
                        throw Error('DynaJobQueue: onJob! error, you should override the onJob function where is called when a job is available');
                    }
                }, {
                    key: '_execute',
                    value: function _execute() {
                        var _this3 = this;

                        if (this._isExecuting) return;
                        var jobToExecute = this._jobs.shift();
                        if (this._jobs.length === 0) this._internalCounter = 0;
                        if (jobToExecute) {
                            // the regular onJob
                            if (jobToExecute._callback === this.onJob) {
                                this._isExecuting = true;
                                jobToExecute._callback(jobToExecute, function () {
                                    _this3._isExecuting = false;
                                    _this3._execute();
                                });
                            } else {
                                this._isExecuting = true;
                                jobToExecute._callback(function () {
                                    _this3._isExecuting = false;
                                    _this3._execute();
                                });
                            }
                        }
                    }
                }, {
                    key: '_createPriorityNumber',
                    value: function _createPriorityNumber(priority) {
                        return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + ++this._internalCounter).substr(-10));
                    }
                }, {
                    key: 'count',
                    get: function get() {
                        return this._jobs.length;
                    }
                }, {
                    key: 'isWorking',
                    get: function get() {
                        return !!this._jobs.length || this._isExecuting;
                    }
                }]);

                return DynaJobQueue;
            }();

            exports.DynaJobQueue = DynaJobQueue;

            /***/
        },
        /* 1 */
        /***/function (module, exports, __webpack_require__) {

            module.exports = __webpack_require__(0);

            /***/
        }]
        /******/)
    );
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ })
/******/ ]);
});