"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileExistsAndCreateType = void 0;
/**
 * @name 检查文件时用到的枚举
 * @export
 * @enum {number}
 */
var checkFileExistsAndCreateType;
(function (checkFileExistsAndCreateType) {
    checkFileExistsAndCreateType[checkFileExistsAndCreateType["DIRECTORY"] = 0] = "DIRECTORY";
    checkFileExistsAndCreateType[checkFileExistsAndCreateType["FILE"] = 1] = "FILE";
})(checkFileExistsAndCreateType = exports.checkFileExistsAndCreateType || (exports.checkFileExistsAndCreateType = {}));
