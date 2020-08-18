import { PageJson } from './interface';
/**
 * @name 从一组路径里查找到所有json文件
 * @export
 * @param {Array<string>} pathArr
 * @returns {Set<string>}
 */
export declare function findJson(pathArr: Set<string>): Set<string>;
/**
 * @name 已知前后文取中间文本
 * @export
 * @param {string} str
 * @param {string} start
 * @param {string} end
 * @returns {(string | null)}
 */
export declare function getStr(str: string, start: string, end: string): string | null;
/**
 * @name 获取数组/对象下的所有组件名称
 * @export
 * @param {(Array<PageJson> | PageJson)} pagesJson
 * @param {boolean} [isNodeModules=false]
 * @param {string} linUiDir
 * @param {string} [miniProgramDirName]
 * @returns {Set<string>}
 */
export declare function getComponentsName(pagesJson: Array<PageJson> | PageJson, isNodeModules: boolean | undefined, linUiDir: string, miniProgramDirName?: string): Set<string>;
/**
 * @name 差集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
export declare function difference<T>(current: Set<T>, target: Set<T>): Set<T>;
/**
 * @name 获取交集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
export declare function intersect<T>(current: Set<T>, target: Set<T>): Set<T>;
/**
 * @name 获取并集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
export declare function union<T>(current: Set<T>, target: Set<T>): Set<T>;
/**
 * @name 格式化json
 * @export
 * @template T
 * @param {T} data
 * @returns {string}
 */
export declare function formatJsonByFile<T extends Object>(data: T): string;
/**
 * @name 数组对象去重
 * @export
 * @param {Array<any>} arr 需要去重的数组或set
 * @param {*} [type] 需要根据哪个字段去重
 * @returns
 */
export declare function deWeight(arr: Array<any> | Set<any>, type: any): Set<any>;
