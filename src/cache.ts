import { existsSync, mkdirSync, readFileSync, PathLike, writeFileSync } from 'fs'
import { BASE_DIR, NODE_MODULES_DIR_NAME } from './config'
/**
 * @name lin-mini-cli缓存系统
 * @export
 * @class LinCache
 */
class LinCache {

    private _cacheDir: PathLike;
    private _cacheFile: PathLike;

    constructor() {
        this._cacheDir = `${BASE_DIR}/${NODE_MODULES_DIR_NAME}/.cache`
        this._cacheFile = this._cacheDir + '/linui-cache.json'
        this._init()
    }

    /**
     * @name 缓存初始化
     * @private
     * @memberof LinCache
     */
    private async _init() {
        if (!existsSync(this._cacheDir)) {
            mkdirSync(this._cacheDir + '/')
            this._initCacheFile()
        } else {
            this._initCacheFile()
        }
    }

    /**
     * @name 缓存文件初始化
     * @private
     * @memberof LinCache
     */
    private _initCacheFile() {
        if (!existsSync(this._cacheFile)) {
            const defaultContent = {
                name: 'lin-ui-cache'
            }
            this._writeCacheFile(defaultContent)
        }
    }

    /**
     * @name 写入缓存文件
     * @private
     * @param {object} data
     * @memberof LinCache
     */
    private _writeCacheFile(data: object) {
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const formatJson = JSON.stringify(data, null, 2)
            writeFileSync(this._cacheFile, formatJson);
        } else {
            console.log(data, '缓存必须为对象格式')
        }

    }

    /**
     * @name 读取缓存文件
     * @private
     * @returns
     * @memberof LinCache
     */
    private _readCacheFile() {
        return JSON.parse(readFileSync(this._cacheFile, 'utf8'))
    }

    /**
     * @name 获取缓存
     * @public
     * @param {any} key
     * @returns
     * @memberof LinCache
     */
    public getItem(key: any) {
        this._init()
        const data = this._readCacheFile()
        return data[key]
    }

    /**
     * @name 设置缓存
     * @public
     * @param {string} key
     * @param {any} info
     * @memberof LinCache
     */
    public setItem(key: string, info: any) {
        let data = this._readCacheFile()
        data[key] = info
        this._writeCacheFile(data)
    }
}
export default new LinCache