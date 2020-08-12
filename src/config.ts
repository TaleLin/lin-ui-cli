import { parseJsonFile } from './file-handle'

export const CLI_VERSION = require('../package.json')['version']

export const BASE_DIR = process.cwd()
export const USER_CONFIG_DIR = BASE_DIR + '/lin.config.json'
const userConfig = parseJsonFile(USER_CONFIG_DIR) || {}

export const LIN_UI_DIR = userConfig['lin-ui-dir'] || 'lin-ui'
export const NODE_MODULES_DIR_NAME = 'node_modules'
export const MINI_PROGRAM_DIR_NAME = userConfig['miniprogram_npm'] || 'miniprogram_npm'
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