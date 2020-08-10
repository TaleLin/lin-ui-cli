"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_handle_1 = require("./file-handle");
const utils_1 = require("./utils");
const config_1 = require("./config");
const cache_1 = __importDefault(require("./cache"));
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
        const componentsName = utils_1.getComponentsName(filejson, true);
        componentsName.forEach(component => {
            result.add(component);
        });
        getDependComponents(componentsName);
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
    // 获取所有的json文件
    const jsonFileArr = utils_1.findJson(pathArr);
    // 解析出所有的json文件
    const pagesJson = file_handle_1.parseJsonFiles(jsonFileArr);
    // 获取使用到组件名
    const componentsName = utils_1.getComponentsName(pagesJson);
    // Set包装
    let result = new Set([...componentsName]);
    // 获取所有组件及依赖的组件
    result = new Set([...getDependComponents(componentsName), ...result]);
    // 合并核心文件
    result = new Set([...result, ...config_1.CORE_DIRS]);
    cache_1.default.setItem('useComponents', [...result]);
    return result;
}
function build() {
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
    for (let dir of differenceMiniDir) {
        file_handle_1.copyFolder(`${config_1.NODE_MODULES_LIN_UI_DIR}/dist/${dir}`, `${config_1.MINI_PROGRAM_LIN_UI_DIR}/${dir}`);
    }
}
exports.default = build;
