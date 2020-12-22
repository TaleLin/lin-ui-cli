import { copyFolder, checkFileExistsAndCreate } from './file-handle'
import { checkFileExistsAndCreateType } from './enum'
import { CNPM_BASE_URL, CLI_VERSION, USER_CONFIG_FILE_NAME, CLI_NAME, MINI_VERSION_URL, MINI_PROGRAM_LIN_UI_DIR } from './config'
import { packageJsonContent, projectConfigContent, linuiConfigContent } from './template'
import { PromptInput } from './interface'
import { join } from 'path'
import inquirer from 'inquirer'
import axios from 'axios'
import { Success, Error, error, primary, success, warn, Warn } from './tip-style'
import shell from 'shelljs'

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
    },
]

/**
 * @name 获取linui最新版本号
 * @returns
 */
async function getLinUiVersion() {
    const res = await axios.get(CNPM_BASE_URL)
    return res.data['dist-tags']['latest']
}

/**
 * @name 获取微信小程序稳定基础版本库
 * @returns
 */
async function getMiniVersion() {
    const res = await axios.get(MINI_VERSION_URL)
    const versions: Array<any> = JSON.parse(res.data['json_data'])['total']
    const versionsSort = versions.sort((a: any, b: any) => {
        return b['percentage'] - a['percentage']
    })
    return versionsSort[0]['sdkVer']
}

export default async function create(dirName: string) {
    const nameOption = {
        type: 'input',
        name: 'name',
        message: `name`,
        default: dirName
    }
    prompt.unshift(nameOption)
    const linuiversion = await getLinUiVersion()
    const versionOption = {
        type: 'input',
        name: 'linVersion',
        message: `请输入您期望安装的 LinUI 版本（默认为最新版）`,
        default: linuiversion
    }
    prompt.push(versionOption)

    const { name, version, description, openLoading, linVersion }: PromptInput = await inquirer.prompt(prompt)
    // 获取linui最新版本号
    // 获取微信小程序稳定基础版本库
    const miniVersion = await getMiniVersion()
    // 获取package.json内容
    const packageJson = packageJsonContent({ name, linuiversion: linVersion, version, description, cliversion: CLI_VERSION, cliname: CLI_NAME })
    // 获取project.config.json内容
    const projectConfig = projectConfigContent(openLoading, USER_CONFIG_FILE_NAME, name, miniVersion)
    // 获取lin.config.json内容
    const linuiConfig = linuiConfigContent()
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
        if (!shell.which('npm')) {
            Warn(warn('Sorry, this script requires npm! Please install npm!'))
            shell.exit(1);
        }
        Success(`${success(`Waiting...`)}`)
        Success(`${success(`Dependencies are now being installed`)}`)
        shell.cd(dirName).exec('npm install')
        checkFileExistsAndCreate(rootPath + '/miniprogram_npm')
        checkFileExistsAndCreate(rootPath + '/miniprogram_npm/lin-ui')
        copyFolder(`${rootPath}/node_modules/lin-ui/dist`, rootPath + '/miniprogram_npm/lin-ui')
        Success(`${success(`Successfully created project ${primary(name)}, directory name is ${primary(dirName)}`)}`)
    } catch (err) {
        Error(error('create error'))
        Error(error(err))
    }
}