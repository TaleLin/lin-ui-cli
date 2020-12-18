import { PageJson } from './interface'

/**
 * @name 从一组路径里查找到所有json文件
 * @export
 * @param {Array<string>} pathArr
 * @returns {Set<string>}
 */
export function findJson(pathArr: Set<string>): Set<string> {
    const result: Set<string> = new Set()
    for (let item of pathArr) {
        const endIndex = item.length
        const str = item.substring(endIndex - 5, endIndex)
        if (str === '.json') {
            result.add(item)
        }
    }
    return result
}

/**
 * @name 已知前后文取中间文本
 * @export
 * @param {string} str
 * @param {string} start
 * @param {string} end
 * @returns {(string | null)}
 */
export function getStr(str: string, start: string, end: string): string | null {
    const reg = new RegExp(`${start}(.*?)${end}`)
    let res = str.match(reg)
    return res ? res[1] : null
}

/**
 * @name 获取数组/对象下的所有组件名称
 * @export
 * @param {(Array<PageJson> | PageJson)} pagesJson
 * @param {boolean} [isNodeModules=false]
 * @param {string} linUiDir
 * @param {string} [miniProgramDirName]
 * @returns {Set<string>}
 */
export function getComponentsName(pagesJson: Array<PageJson> | PageJson, isNodeModules: boolean = false, linUiDir: string, miniProgramDirName?: string): Set<string> {
    const componentsPath: Set<string> = new Set()
    const names: Set<string> = new Set()
    let path = ''

    /**
     * @name 新增组件，并过滤掉所有非lin-ui的组件
     * @param {*} item
     */
    function addComponents(item: PageJson) {
        for (let key of Object.keys(item.usingComponents)) {
            const component: string = item.usingComponents[key]
            if (component.indexOf(linUiDir) !== -1) {
                componentsPath.add(item.usingComponents[key])
            }
            if (isNodeModules) {
                componentsPath.add(item.usingComponents[key])
            }
        }
    }
    if (Array.isArray(pagesJson)) {
        pagesJson.forEach(item => {
            if (item.usingComponents) {
                addComponents(item)
                path = `/${miniProgramDirName}/${linUiDir}/`
            }
        })

    } else {
        if (pagesJson.usingComponents) {
            addComponents(pagesJson)
            path = '../'
        }
    }
    componentsPath.forEach((item: string) => {
        // 当为 /miniprogram_npm/lin-ui/button/index 时
        const componentWithIndex = getStr(item, path, '/index')
        if (componentWithIndex) {
            names.add(componentWithIndex)
            return
        }
        // 当为 /miniprogram_npm/lin-ui/button/ 时
        const component = getStr(item, path, '/')
        if (component) {
            names.add(component)
            return
        }
        // 当为 /miniprogram_npm/lin-ui/button 时
        let arr = item.split(path)
        names.add(arr[arr.length - 1])
    })
    return names
}

/**
 * @name 差集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
export function difference<T>(current: Set<T>, target: Set<T>): Set<T> {
    return new Set(
        [...target].filter(x => !current.has(x))
    )
}

/**
 * @name 获取交集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
export function intersect<T>(current: Set<T>, target: Set<T>): Set<T> {
    return new Set([...target].filter(x => current.has(x)))
}

/**
 * @name 获取并集
 * @export
 * @template T
 * @param {Set<T>} current
 * @param {Set<T>} target
 * @returns {Set<T>}
 */
export function union<T>(current: Set<T>, target: Set<T>): Set<T> {
    return new Set([...current, ...target])
}

/**
 * @name 格式化json
 * @export
 * @template T
 * @param {T} data
 * @returns {string}
 */
export function formatJsonByFile<T extends Object>(data: T): string {
    return JSON.stringify(data, null, 2)
}

/**
 * @name 数组对象去重
 * @export
 * @param {Array<any>} arr 需要去重的数组或set
 * @param {*} [type] 需要根据哪个字段去重
 * @returns
 */
export function deWeight(arr: Array<any> | Set<any>, type: any) {
    let map = new Map();
    for (let item of arr) {
        if (!map.has(item[type])) {
            map.set(item[type], item);
        }
    }
    return new Set([...map.values()]);
}
