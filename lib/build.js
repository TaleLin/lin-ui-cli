"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_handle_1 = require("./file-handle");
const utils_1 = require("./utils");
const config_1 = require("./config");
const enum_1 = require("./enum");
/**
 * @name 深度递归获取所有依赖的组件
 * @param {Set<string>} components
 * @returns {Set<string>}
 */
const result = new Set();
function getDependComponents(components) {
    for (let name of components) {
        const dirName = `${config_1.NODE_MODULES_LIN_UI_DIR}/dist/${name}/index.json`;
        const filejson = file_handle_1.parseJsonFile(dirName);
        const componentsName = utils_1.getComponentsName(filejson, true, config_1.LIN_UI_DIR, config_1.MINI_PROGRAM_DIR_NAME);
        componentsName.forEach(component => {
            result.add(component);
        });
        getDependComponents(componentsName);
    }
    return result;
}
/**
 * @name 获取app.json下的pages
 * @returns
 */
function getAppJsonPages() {
    const result = new Set();
    const appJson = require(config_1.BASE_DIR + '/app.json');
    if (appJson.pages && appJson.pages.length !== 0) {
        for (let page of appJson.pages) {
            result.add(`${config_1.BASE_DIR}/${page}.json`);
        }
    }
    if (appJson.subPackages && appJson.subPackages.length !== 0) {
        for (let pack of appJson.subPackages) {
            for (let page of pack.pages) {
                result.add(`${config_1.BASE_DIR}/${pack.root}/${page}.json`);
            }
        }
    }
    return result;
}
/**
 * @name 拿到所有用户自定义组件
 * @param {Set<string>} jsonFilePaths
 * @returns
 */
function getUserCustomComponentsPath(jsonFilePaths) {
    const result = new Set();
    for (let path of jsonFilePaths) {
        const jsonFile = require(path);
        if (jsonFile.component) {
            result.add(path);
        }
    }
    return result;
}
/**
 * @name 获取项目所使用的组件
 * @returns
 */
function getUseComponents() {
    // 获取项目下所有的文件
    const pathArr = file_handle_1.readDirPath(config_1.BASE_DIR);
    // 过滤掉node_modules 和 miniprogram_npm 文件夹
    for (let pathName of pathArr) {
        if (pathName.indexOf(config_1.MINI_PROGRAM_DIR_NAME) !== -1) {
            pathArr.delete(pathName);
        }
        if (pathName.indexOf(config_1.NODE_MODULES_DIR_NAME) !== -1) {
            pathArr.delete(pathName);
        }
    }
    // 拿到用户实际用到的页面
    const appJsonPage = getAppJsonPages();
    // 根据交集获取到所有注册的页面
    const usePagesPath = utils_1.intersect(pathArr, appJsonPage);
    // 获取所有的json文件
    const jsonFileArr = utils_1.findJson(pathArr);
    // 获取用户自定义组件
    const userCustomComponents = getUserCustomComponentsPath(jsonFileArr);
    // 合并使用的页面以及用户所有自定义组件
    const useAllPaths = utils_1.union(usePagesPath, userCustomComponents);
    // 解析出所有的json文件
    const pagesJson = file_handle_1.parseJsonFiles(useAllPaths);
    // 获取使用到组件名
    const componentsName = utils_1.getComponentsName(pagesJson, false, config_1.LIN_UI_DIR, config_1.MINI_PROGRAM_DIR_NAME);
    // Set包装
    let result = new Set([...componentsName]);
    // 获取所有组件及依赖的组件
    result = utils_1.union(getDependComponents(componentsName), result);
    // 合并核心文件
    result = utils_1.union(result, config_1.CORE_DIRS);
    return result;
}
function build() {
    const startTime = new Date();
    file_handle_1.checkFileExists(config_1.MINI_PROGRAM_DIR_NAME);
    file_handle_1.checkFileExists(config_1.MINI_PROGRAM_LIN_UI_DIR);
    file_handle_1.checkFileExists(config_1.USER_CONFIG_DIR, utils_1.formatJsonByFile({}), enum_1.CheckFileExistsType.FILE);
    let useComponents = getUseComponents();
    const linuiDir = new Set([...file_handle_1.readDirGetFile(`${config_1.NODE_MODULES_LIN_UI_DIR}/dist/`)]);
    // 通过与node_modules差集获取所有未使用组件
    let differenceDir = utils_1.difference(useComponents, linuiDir);
    // 删除未使用的组件
    for (let dir of differenceDir) {
        file_handle_1.deleteFolderRecursive(`${config_1.MINI_PROGRAM_LIN_UI_DIR}/${dir}`);
    }
    //通过与miniprogram_npm差集获取所有已使用但不存在组件
    const miniResult = new Set([...file_handle_1.readDirGetFile(`${config_1.MINI_PROGRAM_LIN_UI_DIR}/`)]);
    const differenceMiniDir = utils_1.difference(miniResult, useComponents);
    // copy组件
    for (let dir of differenceMiniDir) {
        file_handle_1.copyFolder(`${config_1.NODE_MODULES_LIN_UI_DIR}/dist/${dir}`, `${config_1.MINI_PROGRAM_LIN_UI_DIR}/${dir}`);
    }
    const endTime = new Date();
    console.log('总耗时', endTime.getTime() - startTime.getTime() + 'ms');
}
exports.default = build;
