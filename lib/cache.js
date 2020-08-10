"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const config_1 = require("./config");
/**
 * @name lin-mini-cli缓存系统
 * @export
 * @class LinCache
 */
class LinCache {
    constructor() {
        this._cacheDir = `${config_1.BASE_DIR}/${config_1.NODE_MODULES_DIR_NAME}/.cache`;
        this._cacheFile = this._cacheDir + '/linui-cache.json';
        this._init();
    }
    /**
     * @name 缓存初始化
     * @private
     * @memberof LinCache
     */
    async _init() {
        if (!fs_1.existsSync(this._cacheDir)) {
            fs_1.mkdirSync(this._cacheDir + '/');
            this._initCacheFile();
        }
        else {
            this._initCacheFile();
        }
    }
    /**
     * @name 缓存文件初始化
     * @private
     * @memberof LinCache
     */
    _initCacheFile() {
        if (!fs_1.existsSync(this._cacheFile)) {
            const defaultContent = {
                name: 'lin-ui-cache'
            };
            this._writeCacheFile(defaultContent);
        }
    }
    /**
     * @name 写入缓存文件
     * @private
     * @param {object} data
     * @memberof LinCache
     */
    _writeCacheFile(data) {
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const formatJson = JSON.stringify(data, null, 2);
            fs_1.writeFileSync(this._cacheFile, formatJson);
        }
        else {
            console.log(data, '缓存必须为对象格式');
        }
    }
    /**
     * @name 读取缓存文件
     * @private
     * @returns
     * @memberof LinCache
     */
    _readCacheFile() {
        return JSON.parse(fs_1.readFileSync(this._cacheFile, 'utf8'));
    }
    /**
     * @name 获取缓存
     * @public
     * @param {any} key
     * @returns
     * @memberof LinCache
     */
    getItem(key) {
        this._init();
        const data = this._readCacheFile();
        return data[key];
    }
    /**
     * @name 设置缓存
     * @public
     * @param {string} key
     * @param {any} info
     * @memberof LinCache
     */
    setItem(key, info) {
        let data = this._readCacheFile();
        data[key] = info;
        this._writeCacheFile(data);
    }
}
exports.default = new LinCache;
