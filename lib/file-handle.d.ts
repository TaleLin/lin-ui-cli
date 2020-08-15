/// <reference types="node" />
import { PathLike } from 'fs';
import { checkFileExistsAndCreateType } from './enum';
/**
 * @name 读取目录下所有文件
 * @export
 * @param {string} entry 目录名称
 */
export declare function readDirPath(entry: string): Set<string>;
/**
 * @name 读取指定目录的文件（不进行深度遍历，只获取根目录）
 * @export
 * @param {*} entry
 * @returns
 */
export declare function readDirGetFile(entry: string): string[];
/**
 * @name 解析json文件(数组)
 * @export
 * @param {Array<string>} arr
 * @returns
 */
export declare function parseJsonFiles(arr: Set<string>): any[];
/**
 * @name 解析单个文件json
 * @export
 * @param {PathLike} file
 * @returns
 */
export declare function parseJsonFile(file: string): any;
/**
 * @name 删除文件夹
 * @export
 * @param {string} entry
 */
export declare function deleteFolderRecursive(entry: string): void;
export declare function writeFile(path: string | PathLike, data: any): void;
/**
 * @name 拷贝文件夹
 * @export
 * @param {PathLike} currentDir
 * @param {PathLike} targetDir
 */
export declare function copyFolder(currentDir: PathLike, targetDir: PathLike): void;
/**
 * @name 检测文件/文件夹是否存在
 * @export
 * @param {(PathLike | string)} path
 * @returns
 */
export declare function checkFileExists(path: PathLike | string): boolean;
/**
 * @name 检测文件/文件夹是否存在，不存在则创建
 * @export
 * @param {(PathLike | string)} path
 * @param {*} [data]
 * @param {checkFileExistsAndCreateType} [type=checkFileExistsAndCreateType.DIRECTORY]
 */
export declare function checkFileExistsAndCreate(path: PathLike | string, data?: any, type?: checkFileExistsAndCreateType): void;
