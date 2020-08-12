"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_handle_1 = require("./file-handle");
const enum_1 = require("./enum");
const config_1 = require("./config");
const template_1 = require("./template");
const path_1 = require("path");
const inquirer_1 = __importDefault(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
const consola_1 = __importDefault(require("consola"));
const prompt = [
    {
        type: 'input',
        name: 'version',
        message: 'version(1.0.0)',
        default: '1.0.0'
    },
    {
        type: 'input',
        name: 'description',
        message: 'description'
    },
    {
        type: 'input',
        name: 'appid',
        message: 'appid'
    },
    {
        type: 'confirm',
        name: 'openLoading',
        message: '是否开启按需加载?'
    }
];
/**
 * @name 获取linui最新版本号
 * @returns
 */
async function getLinUiVersion() {
    const res = await axios_1.default.get(config_1.CNPM_BASE_URL);
    return res.data['dist-tags']['latest'];
}
async function create(name) {
    const { version, description, openLoading, appid } = await inquirer_1.default.prompt(prompt);
    // 获取linui最新版本号
    const linuiversion = await getLinUiVersion();
    // 获取package.json内容
    const packageJson = template_1.packageJsonContent({ name, linuiversion, version, description, cliversion: config_1.CLI_VERSION });
    // 获取project.config.json内容
    const projectConfig = template_1.projectConfigContent(appid, openLoading);
    // 获取lin.config.json内容
    const linuiConfig = template_1.linuiConfigContent(config_1.LIN_UI_DIR, config_1.MINI_PROGRAM_DIR_NAME);
    // 项目跟路径
    const rootPath = process.cwd() + '/' + name;
    // package.json路径
    const packageJsonPath = `${rootPath}/package.json`;
    // project.config.json路径
    const projectConfigPath = `${rootPath}/project.config.json`;
    // project.config.json路径
    const linConfigPath = `${rootPath}/lin.config.json`;
    // 被复制的文件夹路径
    const currentPath = path_1.join(__dirname, '..') + '/template';
    try {
        // 创建根目录
        file_handle_1.checkFileExists(rootPath);
        // 创建package.json
        file_handle_1.checkFileExists(packageJsonPath, packageJson, enum_1.CheckFileExistsType.FILE);
        // 创建project.config.json
        file_handle_1.checkFileExists(projectConfigPath, projectConfig, enum_1.CheckFileExistsType.FILE);
        // 创建lin.config.json
        file_handle_1.checkFileExists(linConfigPath, linuiConfig, enum_1.CheckFileExistsType.FILE);
        // 复制项目文件
        file_handle_1.copyFolder(currentPath, rootPath);
        consola_1.default.success('项目创建成功');
    }
    catch (error) {
        consola_1.default.error('项目创建失败');
        consola_1.default.error(error);
    }
}
exports.default = create;
