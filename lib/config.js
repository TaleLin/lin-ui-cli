"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORE_DIRS = exports.MINI_PROGRAM_LIN_UI_DIR = exports.NODE_MODULES_LIN_UI_DIR = exports.MINI_PROGRAM_DIR_NAME = exports.NODE_MODULES_DIR_NAME = exports.LIN_UI_DIR = exports.BASE_DIR = void 0;
exports.BASE_DIR = process.cwd();
const userConfig = require(exports.BASE_DIR + '/lin-ui.json');
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
