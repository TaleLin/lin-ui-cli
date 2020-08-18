import { parseJsonFile } from './file-handle'

export const CLI_VERSION = require('../package.json')['version']
export const CLI_NAME = require('../package.json')['name']

export const BASE_DIR = process.cwd()

export const USER_CONFIG_FILE_NAME = 'lin-ui.config.json'
export const USER_CONFIG_FILE = BASE_DIR + '/' + USER_CONFIG_FILE_NAME

const userConfig = parseJsonFile(USER_CONFIG_FILE) || {}
const linUiDir: Array<string> = userConfig['lib'] ? userConfig['lib'].split('/') : []

export const LIN_UI_DIR = linUiDir.pop() || 'lin-ui'
export const NODE_MODULES_DIR_NAME = 'node_modules'
export const MINI_PROGRAM_DIR_NAME = linUiDir.join() || 'miniprogram_npm'
export const NODE_MODULES_LIN_UI_DIR = `${BASE_DIR}/${NODE_MODULES_DIR_NAME}/lin-ui`
export const MINI_PROGRAM_LIN_UI_DIR = `${BASE_DIR}/${MINI_PROGRAM_DIR_NAME}/${LIN_UI_DIR}`
export const CORE_DIRS = new Set([
    'behaviors',
    'filter',
    'utils',
    'common',
    'core'
])

export const CNPM_BASE_URL = 'https://registry.npm.taobao.org/lin-ui'
export const MINI_VERSION_URL = 'https://mp.weixin.qq.com/debug/getpublibpercentage'