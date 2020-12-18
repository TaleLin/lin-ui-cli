"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deWeight = exports.formatJsonByFile = exports.union = exports.intersect = exports.difference = exports.getComponentsName = exports.getStr = exports.findJson = void 0;
/**
 * @name 从一组路径里查找到所有json文件
 * @export
 * @param {Array<string>} pathArr
 * @returns {Set<string>}
 */
function findJson(pathArr) {
    const result = new Set();
    for (let item of pathArr) {
        const endIndex = item.length;
        const str = item.substring(endIndex - 5, endIndex);
        if (str === '.json') {
            result.add(item);
        }
    }
    return result;
}
exports.findJson = findJson;
/**
 * @name 已知前后文取中间文本
 * @export
 * @param {string} str
 * @param {string} start
 * @param {string} end
 * @returns {(string | null)}
 */
function getStr(str, start, end) {
    const reg = new RegExp(`${start}(.*?)${end}`);
    let res = str.match(reg);
    return res ? res[1] : null;
}
exports.getStr = getStr;
/**
 * @name 获取数组/对象下的所有组件名称
 * @export
 * @param {(Array<PageJson> | PageJson)} pagesJson
 * @param {boolean} [isNodeModules=false]
 * @param {string} linUiDir
 * @param {string} [miniProgramDirName]
 * @returns {Set<string>}
 */
function getComponentsName(pagesJson, isNodeModules = false, linUiDir, miniProgramDirName) {
    const componentsPath = new Set();
    const names = new Set();
    let path = '';
    /**
     * @name 新增组件，并过滤掉所有非lin-ui的组件
     * @param {*} item
     */
    function addComponents(item) {
        for (let key of Object.keys(item.usingComponents)) {
            const component = item.usingComponents[key];
            if (component.indexOf(linUiDir) !== -1) {
                componentsPath.add(item.usingComponents[key]);
            }
            if (isNodeModules) {
                componentsPath.add(item.usingComponents[key]);
            }
        }
    }
    if (Array.isArray(pagesJson)) {
        pagesJson.forEach(item => {
            if (item.usingComponents) {
                addComponents(item);
                path = `/${miniProgramDirName}/${linUiDir}/`;
            }
        });
    }
    else {
        if (pagesJson.usingComponents) {
            addComponents(pagesJson);
            path = '../';
        }
    }
    componentsPath.forEach((item) => {
        // 当为 /miniprogram_npm/lin-ui/button/index 时
        const componentWithIndex = getStr(item, path, '/index');
        if (componentWithIndex) {
            names.add(componentWithIndex);
            return;
        }
        // 当为 /miniprogram_npm/lin-ui/button/ 时
        const component = getStr(item, path, '/');
        if (component) {
            names.add(component);
            return;
        }
        // 当为 /miniprogram_npm/lin-ui/button 时
        let arr = item.split(path);
        names.add(arr[arr.length - 1]);
    });
    return names;
}
exports.getComponentsName = getComponentsName;
/**
 * @name 差集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
function difference(current, target) {
    return new Set([...target].filter(x => !current.has(x)));
}
exports.difference = difference;
/**
 * @name 获取交集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
function intersect(current, target) {
    return new Set([...target].filter(x => current.has(x)));
}
exports.intersect = intersect;
/**
 * @name 获取并集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
function union(current, target) {
    return new Set([...current, ...target]);
}
exports.union = union;
/**
 * @name 格式化json
 * @export
 * @template T
 * @param {T} data
 * @returns {string}
 */
function formatJsonByFile(data) {
    return JSON.stringify(data, null, 2);
}
exports.formatJsonByFile = formatJsonByFile;
/**
 * @name 数组对象去重
 * @export
 * @param {Array<any>} arr 需要去重的数组或set
 * @param {*} [type] 需要根据哪个字段去重
 * @returns
 */
function deWeight(arr, type) {
    let map = new Map();
    for (let item of arr) {
        if (!map.has(item[type])) {
            map.set(item[type], item);
        }
    }
    return new Set([...map.values()]);
}
exports.deWeight = deWeight;
