import { PageJson } from './interface'
import { MINI_PROGRAM_DIR_NAME, LIN_UI_DIR } from './config'

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
 * @param {boolean} [isNodeModules=false] 是否是node_modules/lin-ui/dist下的组件，当为true的时候，需要做不同处理
 * @returns {Set<string>}
 */
export function getComponentsName(pagesJson: Array<PageJson> | PageJson, isNodeModules: boolean = false): Set<string> {
    const componentsPath: Set<string> = new Set()
    const names: Set<string> = new Set()
    let path = ''

    /**
     * @name 新增组件，并过滤掉所有非lin-ui的组件
     * @param {*} item
     */
    function addComponents(item: PageJson) {
        for (let key of Object.keys(item.usingComponents)) {
            const component:string = item.usingComponents[key]
            if(component.indexOf(LIN_UI_DIR) !== -1) {
                componentsPath.add(item.usingComponents[key])
            }
            if(isNodeModules) {
                componentsPath.add(item.usingComponents[key])
            }
        }
    }
    if (Array.isArray(pagesJson)) {
        pagesJson.forEach(item => {
            if (item.usingComponents) {
                addComponents(item)
                path = `/${MINI_PROGRAM_DIR_NAME}/${LIN_UI_DIR}/`
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