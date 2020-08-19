import { readdirSync, statSync, writeFileSync, PathLike, existsSync, unlinkSync, mkdirSync, rmdirSync, createReadStream, accessSync, createWriteStream, constants, readFileSync } from 'fs'
import { join } from 'path'
import { checkFileExistsAndCreateType } from './enum'
import { Error, error, Warn, warn } from './tip-style'
const pathList: Set<string> = new Set()
/**
 * @name 读取目录下所有文件
 * @export
 * @param {string} entry 目录名称
 */
export function readDirPath(entry: string): Set<string> {
    const dirInfo = readdirSync(entry);
    for (let item of dirInfo) {
        const location = join(entry, item);
        const info = statSync(location);
        if (info.isDirectory()) {
            readDirPath(location);
        } else {
            pathList.add(location)
        }
    }
    return pathList
}

/**
 * @name 读取指定目录的文件（不进行深度遍历，只获取根目录）
 * @export
 * @param {*} entry
 * @returns
 */
export function readDirGetFile(entry: string) {
    const dirInfo = readdirSync(entry);
    return dirInfo
}

/**
 * @name 解析json文件(数组)
 * @export
 * @param {Array<string>} arr
 * @returns
 */
export function parseJsonFiles(arr: Set<string>) {
    const result = []
    for (let item of arr) {
        const data = parseJsonFile(item);
        result.push(data)
    }
    return result
}

/**
 * @name 解析单个文件json
 * @export
 * @param {PathLike} file
 * @returns
 */
export function parseJsonFile(file: string) {
    try {
        const data = readFileSync(file, 'utf8');
        return JSON.parse(data)
    } catch (error) {
        return
    }
}

/**
 * @name 删除文件夹
 * @export
 * @param {string} entry
 */
export function deleteFolderRecursive(entry: string) {
    let files = [];
    // 判断给定的路径是否存在
    if (existsSync(entry)) {
        // 返回文件和子目录的数组
        files = readdirSync(entry);
        for (let file of files) {
            const curPath = join(entry, file);
            // fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
            if (statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                // 是文件delete file  
            } else {
                unlinkSync(curPath);
            }
        }
        // 清除文件夹
        rmdirSync(entry);
    } else {
        // console.log("文件夹不存在");
    }
};

export function writeFile(path: string | PathLike, data: any) {
    try {
        writeFileSync(path, data)
    } catch (err) {
        Error(error(err))
        Error(error('文件写入失败'))
    }
}

/**
 * @name 拷贝文件夹
 * @export
 * @param {PathLike} currentDir
 * @param {PathLike} targetDir
 */
export function copyFolder(currentDir: PathLike, targetDir: PathLike) {

    function handleFolder(currentDir: PathLike, targetDir: PathLike) {
        const files = readdirSync(currentDir, {
            withFileTypes: true
        })
        for (let file of files) {
            // 拼接文件绝对路径
            const copyCurrentFileInfo = currentDir + '/' + file.name
            const copyTargetFileInfo = targetDir + '/' + file.name
            // 判断文件是否存在
            const readCurrentFile = existsSync(copyCurrentFileInfo)
            const readTargetFile = existsSync(copyTargetFileInfo)
            if (readCurrentFile && !readTargetFile) {
                // 判断是否为文件，如果为文件则复制，文件夹则递归
                if (file.isFile()) {
                    const readStream = createReadStream(copyCurrentFileInfo)
                    const writeStream = createWriteStream(copyTargetFileInfo)
                    readStream.pipe(writeStream)
                } else {
                    try {
                        accessSync(join(copyTargetFileInfo, '..'), constants.W_OK)
                        copyFolder(copyCurrentFileInfo, copyTargetFileInfo)
                    } catch (error) {
                        Warn('权限不足' + error)
                    }
                }
            } else {
                Error(error('操作失败，target文件夹已存在或current文件夹不存在'))
            }

        }
    }

    if (existsSync(currentDir)) {
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir)
        }
        handleFolder(currentDir, targetDir)
    } else {
        Warn(warn('需要copy的文件夹不存在:' + currentDir))
    }
}

/**
 * @name 检测文件/文件夹是否存在
 * @export
 * @param {(PathLike | string)} path
 * @returns
 */
export function checkFileExists(path: PathLike | string) {
    return existsSync(path)
}

/**
 * @name 检测文件/文件夹是否存在，不存在则创建
 * @export
 * @param {(PathLike | string)} path
 * @param {*} [data]
 * @param {checkFileExistsAndCreateType} [type=checkFileExistsAndCreateType.DIRECTORY]
 */
export function checkFileExistsAndCreate(path: PathLike | string, data?: any, type: checkFileExistsAndCreateType = checkFileExistsAndCreateType.DIRECTORY): void {
    if (!checkFileExists(path)) {
        switch (type) {
            case checkFileExistsAndCreateType.DIRECTORY:
                mkdirSync(path)
                break;
            case checkFileExistsAndCreateType.FILE:
                writeFile(path, data)
                break;
            default:
                mkdirSync(path)
                break;
        }
    }
}