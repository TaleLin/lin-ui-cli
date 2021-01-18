import { readDirPath, parseJsonFiles, parseJsonFile, readDirGetFile, checkFileExistsAndCreate, writeFile } from './file-handle'
import { findJson, getComponentsName, difference, union, intersect, formatJsonByFile, deWeight } from './utils';
import { BASE_DIR, MINI_PROGRAM_LIN_UI_DIR, MINI_PROGRAM_DIR_NAME, NODE_MODULES_DIR_NAME, LIN_UI_DIR, CORE_DIRS, USER_CONFIG_FILE, USER_CONFIG_FILE_NAME } from './config'
import { AppJson, PageJson, ProjectConfigInterface, PackOptionsIgnore } from './interface'
import { checkFileExistsAndCreateType } from './enum'
import { Success, Start, Error, success, error, primary } from './tip-style'

/**
 * @name 深度递归获取所有依赖的组件
 * @param {Set<string>} components
 * @returns {Set<string>}
 */
const result: Set<string> = new Set();
function getDependComponents(components: Set<string>): Set<string> {
    for (let name of components) {
        const dirName = `${MINI_PROGRAM_LIN_UI_DIR}/${name}/index.json`
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
    const usePagesPath = intersect<string>(pathArr, appJsonPage)
    // 获取所有的json文件
    const jsonFileArr = findJson(pathArr)
    // 获取用户自定义组件
    const userCustomComponents = getUserCustomComponentsPath(jsonFileArr)
    // 合并使用的页面以及用户所有自定义组件
    const useAllPaths = union<string>(usePagesPath, userCustomComponents)
    // 解析出所有的json文件
    const pagesJson = parseJsonFiles(useAllPaths)
    // 获取使用到组件名
    const componentsName = getComponentsName(pagesJson, false, LIN_UI_DIR, MINI_PROGRAM_DIR_NAME)
    // Set包装
    let result = new Set([...componentsName])
    // 获取所有组件及依赖的组件
    result = union<string>(getDependComponents(componentsName), result)
    // 合并核心文件
    result = union<string>(result, CORE_DIRS)
    return result
}


export default function build() {
    const startTime = new Date()
    try {
        checkFileExistsAndCreate(MINI_PROGRAM_DIR_NAME)
        checkFileExistsAndCreate(MINI_PROGRAM_LIN_UI_DIR)
        checkFileExistsAndCreate(USER_CONFIG_FILE, formatJsonByFile({}), checkFileExistsAndCreateType.FILE)
        let useComponents = getUseComponents()
        const linuiComponents = new Set([...readDirGetFile(`${MINI_PROGRAM_LIN_UI_DIR}/`)])
        // 通过与组件存放目录差集获取所有未使用组件
        let differenceComponents = difference<string>(useComponents, linuiComponents)
        const newIgnore: Set<PackOptionsIgnore> = new Set()
        for (let component of differenceComponents) {
            Start(primary(`${success(`正在处理未使用组件`)}           ${component}`))
            const minidir = `${MINI_PROGRAM_LIN_UI_DIR}/${component}`.split(BASE_DIR + '/')[1]
            newIgnore.add({
                value: minidir,
                type: "folder"
            })
            Success(primary(`${success('组件已封装')}                       ${component}`))
        }
        const projectConfigFile = BASE_DIR + '/project.config.json'
        let projectConfig: ProjectConfigInterface = require(projectConfigFile)
        // const oldIgnore: Set<PackOptionsIgnore> = new Set([...projectConfig.packOptions.ignore])
        // 忽略.gitignore打包
        newIgnore.add({
            value: ".gitignore",
            type: "file"
        })
        // 忽略cli config打包
        newIgnore.add({
            value: USER_CONFIG_FILE_NAME,
            type: "file"
        })
        // const resultIgnore = deWeight(union<PackOptionsIgnore>(oldIgnore, newIgnore), "value")
        projectConfig.packOptions.ignore = [...newIgnore]
        writeFile(projectConfigFile, formatJsonByFile(projectConfig))
        Success(success('success'))
    } catch (err) {
        Error(error('error'))
        Error(error(err))
    }
    const endTime = new Date()
    Success('总耗时' + primary(endTime.getTime() - startTime.getTime() + 'ms'))
}