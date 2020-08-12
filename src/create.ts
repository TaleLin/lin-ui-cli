import { copyFolder, checkFileExists } from './file-handle'
import { CheckFileExistsType } from './enum'
import { CNPM_BASE_URL, LIN_UI_DIR, MINI_PROGRAM_DIR_NAME, CLI_VERSION } from './config'
import { packageJsonContent, projectConfigContent, linuiConfigContent } from './template'
import { PromptInput } from './interface'
import { join } from 'path'
import inquirer from 'inquirer'
import axios from 'axios'
import consola from 'consola'

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
]

/**
 * @name 获取linui最新版本号
 * @returns
 */
async function getLinUiVersion() {
    const res = await axios.get(CNPM_BASE_URL)
    return res.data['dist-tags']['latest']
}

export default async function create(name: string) {
    const { version, description, openLoading, appid }: PromptInput = await inquirer.prompt(prompt)
    // 获取linui最新版本号
    const linuiversion = await getLinUiVersion()
    // 获取package.json内容
    const packageJson = packageJsonContent({ name, linuiversion, version, description, cliversion: CLI_VERSION })
    // 获取project.config.json内容
    const projectConfig = projectConfigContent(appid, openLoading)
    // 获取lin.config.json内容
    const linuiConfig = linuiConfigContent(LIN_UI_DIR, MINI_PROGRAM_DIR_NAME)
    // 项目跟路径
    const rootPath = process.cwd() + '/' + name
    // package.json路径
    const packageJsonPath = `${rootPath}/package.json`
    // project.config.json路径
    const projectConfigPath = `${rootPath}/project.config.json`
    // project.config.json路径
    const linConfigPath = `${rootPath}/lin.config.json`
    // 被复制的文件夹路径
    const currentPath = join(__dirname, '..') + '/template'
    try {
        // 创建根目录
        checkFileExists(rootPath)
        // 创建package.json
        checkFileExists(packageJsonPath, packageJson, CheckFileExistsType.FILE)
        // 创建project.config.json
        checkFileExists(projectConfigPath, projectConfig, CheckFileExistsType.FILE)
        // 创建lin.config.json
        checkFileExists(linConfigPath, linuiConfig, CheckFileExistsType.FILE)
        // 复制项目文件
        copyFolder(currentPath, rootPath)
        consola.success('项目创建成功')
    } catch (error) {
        consola.error('项目创建失败')
        consola.error(error)
    }
}