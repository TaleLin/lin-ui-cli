"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINI_VERSION_URL = exports.CNPM_BASE_URL = exports.CORE_DIRS = exports.MINI_PROGRAM_LIN_UI_DIR = exports.NODE_MODULES_LIN_UI_DIR = exports.MINI_PROGRAM_DIR_NAME = exports.NODE_MODULES_DIR_NAME = exports.LIN_UI_DIR = exports.USER_CONFIG_FILE = exports.USER_CONFIG_FILE_NAME = exports.BASE_DIR = exports.CLI_NAME = exports.CLI_VERSION = void 0;
const file_handle_1 = require("./file-handle");
exports.CLI_VERSION = require('../package.json')['version'];
exports.CLI_NAME = require('../package.json')['name'];
exports.BASE_DIR = process.cwd();
exports.USER_CONFIG_FILE_NAME = 'lin-ui.config.json';
exports.USER_CONFIG_FILE = exports.BASE_DIR + '/' + exports.USER_CONFIG_FILE_NAME;
const userConfig = file_handle_1.parseJsonFile(exports.USER_CONFIG_FILE) || {};
const linUiDir = userConfig['lib'] ? userConfig['lib'].split('/') : [];
exports.LIN_UI_DIR = linUiDir.pop() || 'lin-ui';
exports.NODE_MODULES_DIR_NAME = 'node_modules';
exports.MINI_PROGRAM_DIR_NAME = linUiDir.join() || 'miniprogram_npm';
exports.NODE_MODULES_LIN_UI_DIR = `${exports.BASE_DIR}/${exports.NODE_MODULES_DIR_NAME}/lin-ui`;
exports.MINI_PROGRAM_LIN_UI_DIR = `${exports.BASE_DIR}/${exports.MINI_PROGRAM_DIR_NAME}/${exports.LIN_UI_DIR}`;
exports.CORE_DIRS = new Set([
    'behaviors',
    'filter',
    'utils',
    'common',
    'core'
]);
exports.CNPM_BASE_URL = 'https://registry.npm.taobao.org/lin-ui';
exports.MINI_VERSION_URL = 'https://mp.weixin.qq.com/debug/getpublibpercentage';
