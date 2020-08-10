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
 * @param {boolean} [isNodeModules=false] 是否是node_modules/lin-ui/dist下的组件，当为true的时候，需要做不同处理
 * @returns {Set<string>}
 */
export declare function getComponentsName(pagesJson: Array<PageJson> | PageJson, isNodeModules?: boolean): Set<string>;
/**
 * @name 差集
 * @export
 * @param {Set<string>} current
 * @param {Set<string>} target
 * @returns {Set<string>}
 */
export declare function difference(current: Set<string>, target: Set<string>): Set<string>;
