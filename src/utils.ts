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
    let res = str.match(new RegExp(`${start}(.*?)${end}`))
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
        const component = getStr(item, path, '/index')
        if (component) {
            names.add(component)
        }
    })
    return names
}

/**
 * @name 差集
 * @export
 * @param {Set<string>} current
 * @param {Set<string>} target
 * @returns {Set<string>}
 */
export function difference(current: Set<string>, target: Set<string>): Set<string> {
    return new Set(
        [...target].filter(x => !current.has(x))
    )
}

/**
 * @name 获取交集
 * @export
 * @param {Set<string>} current
 * @param {Set<string>} target
 * @returns {Set<string>}
 */
export function intersect(current: Set<string>, target: Set<string>): Set<string> {
    return new Set([...target].filter(x => current.has(x)))
}

/**
 * @name 获取并集
 * @export
 * @param {Set<string>} current
 * @param {Set<string>} target
 * @returns {Set<string>}
 */
export function union(current: Set<string>, target: Set<string>): Set<string> {
    return new Set([...current, ...target])
}

/**
 * @name 格式化json
 * @export
 * @param {any} data
 * @returns {string}
 */
export function formatJsonByFile(data: any): string {
    return JSON.stringify(data, null, 2)
}
