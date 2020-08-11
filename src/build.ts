import { readDirPath, parseJsonFiles, parseJsonFile, readDirGetFile, deleteFolderRecursive, copyFolder, checkFileExists } from './file-handle'
import { findJson, getComponentsName, difference, union, intersect, formatJsonByFile } from './utils';
import { BASE_DIR, NODE_MODULES_LIN_UI_DIR, MINI_PROGRAM_LIN_UI_DIR, MINI_PROGRAM_DIR_NAME, NODE_MODULES_DIR_NAME, LIN_UI_DIR, CORE_DIRS,USER_CONFIG_DIR  } from './config'
import { AppJson, PageJson } from './interface'
import { CheckFileExistsType } from './enum'
import consola from 'consola'
/**
 * @name 深度递归获取所有依赖的组件
 * @param {Set<string>} components
 * @returns {Set<string>}
 */
const result: Set<string> = new Set();
function getDependComponents(components: Set<string>): Set<string> {
    for (let name of components) {
        const dirName = `${NODE_MODULES_LIN_UI_DIR}/dist/${name}/index.json`
        const filejson = parseJsonFile(dirName)
        const componentsName = getComponentsName(filejson, true, LIN_UI_DIR, MINI_PROGRAM_DIR_NAME)
        componentsName.forEach(component => {
            result.add(component)
        })
        getDependComponents(componentsName)
    }
    return result
}

/**
 * @name 获取app.json下的pages
 * @returns
 */
function getAppJsonPages() {
    const result: Set<string> = new Set()
    const appJson: AppJson = require(BASE_DIR + '/app.json')
    if (appJson.pages && appJson.pages.length !== 0) {
        for (let page of appJson.pages) {
            result.add(`${BASE_DIR}/${page}.json`)
        }
    }
    if (appJson.subPackages && appJson.subPackages.length !== 0) {
        for (let pack of appJson.subPackages) {
            for (let page of pack.pages) {
                result.add(`${BASE_DIR}/${pack.root}/${page}.json`)
            }
        }
    }
    return result
}

/**
 * @name 拿到所有用户自定义组件
 * @param {Set<string>} jsonFilePaths
 * @returns
 */
function getUserCustomComponentsPath(jsonFilePaths: Set<string>) {
    const result: Set<string> = new Set()
    for (let path of jsonFilePaths) {
        const jsonFile: PageJson = require(path)
        if (jsonFile.component) {
            result.add(path)
        }
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
    // 拿到用户实际用到的页面
    const appJsonPage = getAppJsonPages()
    // 根据交集获取到所有注册的页面
    const usePagesPath = intersect(pathArr, appJsonPage)
    // 获取所有的json文件
    const jsonFileArr = findJson(pathArr)
    // 获取用户自定义组件
    const userCustomComponents = getUserCustomComponentsPath(jsonFileArr)
    // 合并使用的页面以及用户所有自定义组件
    const useAllPaths = union(usePagesPath, userCustomComponents)
    // 解析出所有的json文件
    const pagesJson = parseJsonFiles(useAllPaths)
    // 获取使用到组件名
    const componentsName = getComponentsName(pagesJson, false, LIN_UI_DIR, MINI_PROGRAM_DIR_NAME)
    // Set包装
    let result = new Set([...componentsName])
    // 获取所有组件及依赖的组件
    result = union(getDependComponents(componentsName), result)
    // 合并核心文件
    result = union(result, CORE_DIRS)
    return result
}


export default function build() {
    const startTime = new Date()
    try {
        checkFileExists(MINI_PROGRAM_DIR_NAME)
        checkFileExists(MINI_PROGRAM_LIN_UI_DIR)
        checkFileExists(USER_CONFIG_DIR, formatJsonByFile({}), CheckFileExistsType.FILE)
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
        // copy组件
        for (let dir of differenceMiniDir) {
            copyFolder(`${NODE_MODULES_LIN_UI_DIR}/dist/${dir}`, `${MINI_PROGRAM_LIN_UI_DIR}/${dir}`)
        }
        consola.success('执行成功')
    } catch (error) {
        consola.error('执行失败')
        consola.error(error)
    }
    const endTime = new Date()
    consola.log('总耗时', endTime.getTime() - startTime.getTime() + 'ms')
}