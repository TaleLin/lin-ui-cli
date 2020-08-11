/**
 * @name lin-mini-cli缓存系统
 * @export
 * @class LinCache
 */
declare class LinCache {
    private _cacheDir;
    private _cacheFile;
    constructor();
    /**
     * @name 缓存初始化
     * @private
     * @memberof LinCache
     */
    private _init;
    /**
     * @name 缓存文件初始化
     * @private
     * @memberof LinCache
     */
    private _initCacheFile;
    /**
     * @name 写入缓存文件
     * @private
     * @param {object} data
     * @memberof LinCache
     */
    private _writeCacheFile;
    /**
     * @name 读取缓存文件
     * @private
     * @returns
     * @memberof LinCache
     */
    private _readCacheFile;
    /**
     * @name 获取缓存
     * @public
     * @param {any} key
     * @returns
     * @memberof LinCache
     */
    getItem(key: any): any;
    /**
     * @name 设置缓存
     * @public
     * @param {string} key
     * @param {any} info
     * @memberof LinCache
     */
    setItem(key: string, info: any): void;
    version(): any;
}
declare const _default: LinCache;
export default _default;
