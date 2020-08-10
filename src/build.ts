import {
    readDirPath,
    parseJsonFiles,
    parseJsonFile,
    readDirGetFile,
    deleteFolderRecursive,
    copyFolder
} from './file-handle'
import {
    findJson,
    getComponentsName,
    difference
} from './utils';

import {
    BASE_DIR,
    NODE_MODULES_LIN_UI_DIR,
    MINI_PROGRAM_LIN_UI_DIR,
    MINI_PROGRAM_DIR_NAME,
    NODE_MODULES_DIR_NAME,
    CORE_DIRS
} from './config'

import linCache from './cache'

/**
 * @name 深度递归获取所有依赖的组件
 * @param {Set<string>} components
 * @returns {Set<string>}
 */
function getDependComponents(components: Set<string>): Set<string> {
    let result: Set<string> = new Set();
    for (let name of components) {
        const dirName = `${NODE_MODULES_LIN_UI_DIR}/dist/${name}/index.json`
        const filejson = parseJsonFile(dirName)
        const componentsName = getComponentsName(filejson)
        componentsName.forEach(component => {
            result.add(component)
        })
        getDependComponents(componentsName)
    }
    return result
}

/**
 * @name 获取项目所使用的组件
 * @returns
 */
function getUseComponents() {
    // 获取项目下所有的文件
    const pathArr = readDirPath(BASE_DIR)
    // 过滤掉node_modules 和 miniprogram_npm 文件夹
    for (let pathName of pathArr) {
        if (pathName.indexOf(MINI_PROGRAM_DIR_NAME) !== -1) {
            pathArr.delete(pathName)
        }
        if (pathName.indexOf(NODE_MODULES_DIR_NAME) !== -1) {
            pathArr.delete(pathName)
        }
    }
    // 获取所有的json文件
    const jsonFileArr = findJson(pathArr)
    // 解析出所有的json文件
    const pagesJson = parseJsonFiles(jsonFileArr)
    // 获取使用到组件名
    const componentsName = getComponentsName(pagesJson)
    // Set包装
    let result = new Set([...componentsName])
    // 获取所有组件及依赖的组件
    result = new Set([...getDependComponents(componentsName), ...result])
    // 合并核心文件
    result = new Set([...result, ...CORE_DIRS])
    linCache.setItem('useComponents', [...result])
    return result
}

export default function build() {
    let useComponents = getUseComponents()
    const linuiDir = new Set([...readDirGetFile(`${NODE_MODULES_LIN_UI_DIR}/dist/`)])
    // 通过与node_modules差集获取所有未使用组件
    let differenceDir = difference(useComponents, linuiDir)
    // 删除未使用的组件
    for (let dir of differenceDir) {
        deleteFolderRecursive(`${MINI_PROGRAM_LIN_UI_DIR}/${dir}`)
    }

    //通过与miniprogram_npm差集获取所有已使用但不存在组件
    const miniResult = new Set([...readDirGetFile(`${MINI_PROGRAM_LIN_UI_DIR}/`)])

    const differenceMiniDir = difference(miniResult, useComponents)

    for (let dir of differenceMiniDir) {
        copyFolder(`${NODE_MODULES_LIN_UI_DIR}/dist/${dir}`, `${MINI_PROGRAM_LIN_UI_DIR}/${dir}`)
    }
}