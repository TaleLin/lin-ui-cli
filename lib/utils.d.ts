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
 * @returns {Set<string>}
 */
export declare function getComponentsName(pagesJson: Array<PageJson> | PageJson): Set<string>;
/**
 * @name 差集
 * @export
 * @param {Set<string>} current
 * @param {Set<string>} target
 * @returns {Set<string>}
 */
export declare function difference(current: Set<string>, target: Set<string>): Set<string>;
