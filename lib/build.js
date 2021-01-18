"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_handle_1 = require("./file-handle");
const utils_1 = require("./utils");
const config_1 = require("./config");
const enum_1 = require("./enum");
const tip_style_1 = require("./tip-style");
/**
 * @name 深度递归获取所有依赖的组件
 * @param {Set<string>} components
 * @returns {Set<string>}
 */
const result = new Set();
function getDependComponents(components) {
    for (let name of components) {
        const dirName = `${config_1.MINI_PROGRAM_LIN_UI_DIR}/${name}/index.json`;
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
    try {
        file_handle_1.checkFileExistsAndCreate(config_1.MINI_PROGRAM_DIR_NAME);
        file_handle_1.checkFileExistsAndCreate(config_1.MINI_PROGRAM_LIN_UI_DIR);
        file_handle_1.checkFileExistsAndCreate(config_1.USER_CONFIG_FILE, utils_1.formatJsonByFile({}), enum_1.checkFileExistsAndCreateType.FILE);
        let useComponents = getUseComponents();
        const linuiComponents = new Set([...file_handle_1.readDirGetFile(`${config_1.MINI_PROGRAM_LIN_UI_DIR}/`)]);
        // 通过与组件存放目录差集获取所有未使用组件
        let differenceComponents = utils_1.difference(useComponents, linuiComponents);
        const newIgnore = new Set();
        for (let component of differenceComponents) {
            tip_style_1.Start(tip_style_1.primary(`${tip_style_1.success(`正在处理未使用组件`)}           ${component}`));
            const minidir = `${config_1.MINI_PROGRAM_LIN_UI_DIR}/${component}`.split(config_1.BASE_DIR + '/')[1];
            newIgnore.add({
                value: minidir,
                type: "folder"
            });
            tip_style_1.Success(tip_style_1.primary(`${tip_style_1.success('组件已封装')}                       ${component}`));
        }
        const projectConfigFile = config_1.BASE_DIR + '/project.config.json';
        let projectConfig = require(projectConfigFile);
        // const oldIgnore: Set<PackOptionsIgnore> = new Set([...projectConfig.packOptions.ignore])
        // 忽略.gitignore打包
        newIgnore.add({
            value: ".gitignore",
            type: "file"
        });
        // 忽略cli config打包
        newIgnore.add({
            value: config_1.USER_CONFIG_FILE_NAME,
            type: "file"
        });
        // const resultIgnore = deWeight(union<PackOptionsIgnore>(oldIgnore, newIgnore), "value")
        projectConfig.packOptions.ignore = [...newIgnore];
        file_handle_1.writeFile(projectConfigFile, utils_1.formatJsonByFile(projectConfig));
        tip_style_1.Success(tip_style_1.success('success'));
    }
    catch (err) {
        tip_style_1.Error(tip_style_1.error('error'));
        tip_style_1.Error(tip_style_1.error(err));
    }
    const endTime = new Date();
    tip_style_1.Success('总耗时' + tip_style_1.primary(endTime.getTime() - startTime.getTime() + 'ms'));
}
exports.default = build;
