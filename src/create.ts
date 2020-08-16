import { copyFolder, checkFileExistsAndCreate } from './file-handle'
import { checkFileExistsAndCreateType } from './enum'
import { CNPM_BASE_URL, LIN_UI_DIR, MINI_PROGRAM_DIR_NAME, CLI_VERSION, USER_CONFIG_FILE_NAME, CLI_NAME } from './config'
import { packageJsonContent, projectConfigContent, linuiConfigContent } from './template'
import { PromptInput } from './interface'
import { join } from 'path'
import inquirer from 'inquirer'
import axios from 'axios'
import { Success, Error, error, primary, success } from './tip-style'

const prompt = [
    {
        type: 'input',
        name: 'version',
        message: 'version',
        default: '1.0.0'
    },
    {
        type: 'input',
        name: 'description',
        message: 'description'
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

export default async function create(dirName: string) {
    const nameOption = {
        type: 'input',
        name: 'name',
        message: `name`,
        default: dirName
    }
    prompt.unshift(nameOption)

    const { name, version, description, openLoading }: PromptInput = await inquirer.prompt(prompt)
    // 获取linui最新版本号
    const linuiversion = await getLinUiVersion()
    // 获取package.json内容
    const packageJson = packageJsonContent({ name, linuiversion, version, description, cliversion: CLI_VERSION, cliname: CLI_NAME })
    // 获取project.config.json内容
    const projectConfig = projectConfigContent(openLoading, USER_CONFIG_FILE_NAME, name)
    // 获取lin.config.json内容
    const linuiConfig = linuiConfigContent(LIN_UI_DIR, MINI_PROGRAM_DIR_NAME)
    // 项目跟路径
    const rootPath = process.cwd() + '/' + dirName
    // package.json路径
    const packageJsonPath = `${rootPath}/package.json`
    // project.config.json路径
    const projectConfigPath = `${rootPath}/project.config.json`
    // project.config.json路径
    const linConfigPath = `${rootPath}/${USER_CONFIG_FILE_NAME}`
    // 被复制的文件夹路径
    const currentPath = join(__dirname, '..') + '/template'
    try {
        // 创建根目录
        checkFileExistsAndCreate(rootPath)
        // 创建package.json
        checkFileExistsAndCreate(packageJsonPath, packageJson, checkFileExistsAndCreateType.FILE)
        // 创建project.config.json
        checkFileExistsAndCreate(projectConfigPath, projectConfig, checkFileExistsAndCreateType.FILE)
        // 创建lin.config.json
        checkFileExistsAndCreate(linConfigPath, linuiConfig, checkFileExistsAndCreateType.FILE)
        // 复制项目文件
        copyFolder(currentPath, rootPath)
        Success(`${success(`Successfully created project ${primary(name)}, directory name is ${primary(dirName)}`)}`)
        Success(`${success(`Next: Please run ${primary(`cd ${dirName} && npm install or yarn`)}`)}`)
    } catch (err) {
        Error(error('create error'))
        Error(error(err))
    }
}