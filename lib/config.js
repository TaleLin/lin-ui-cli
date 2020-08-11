"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORE_DIRS = exports.MINI_PROGRAM_LIN_UI_DIR = exports.NODE_MODULES_LIN_UI_DIR = exports.MINI_PROGRAM_DIR_NAME = exports.NODE_MODULES_DIR_NAME = exports.LIN_UI_DIR = exports.BASE_DIR = void 0;
const file_handle_1 = require("./file-handle");
const enum_1 = require("./enum");
const utils_1 = require("./utils");
exports.BASE_DIR = process.cwd();
const UserConfigDir = exports.BASE_DIR + '/lin-ui.json';
const data = utils_1.formatJsonByFile({});
file_handle_1.checkFileExists(UserConfigDir, data, enum_1.CheckFileExistsType.FILE);
const userConfig = require(UserConfigDir);
exports.LIN_UI_DIR = userConfig['lin-ui-dir'] || 'lin-ui';
exports.NODE_MODULES_DIR_NAME = 'node_modules';
exports.MINI_PROGRAM_DIR_NAME = userConfig['miniprogram_npm'] || 'miniprogram_npm';
exports.NODE_MODULES_LIN_UI_DIR = `${exports.BASE_DIR}/${exports.NODE_MODULES_DIR_NAME}/${exports.LIN_UI_DIR}`;
exports.MINI_PROGRAM_LIN_UI_DIR = `${exports.BASE_DIR}/${exports.MINI_PROGRAM_DIR_NAME}/${exports.LIN_UI_DIR}`;
exports.CORE_DIRS = new Set([
    'behaviors',
    'filter',
    'utils',
    'common',
    'core'
]);
