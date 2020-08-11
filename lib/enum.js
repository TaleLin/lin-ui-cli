"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckFileExistsType = void 0;
/**
 * @name 检查文件时用到的枚举
 * @export
 * @enum {number}
 */
var CheckFileExistsType;
(function (CheckFileExistsType) {
    CheckFileExistsType[CheckFileExistsType["DIRECTORY"] = 0] = "DIRECTORY";
    CheckFileExistsType[CheckFileExistsType["FILE"] = 1] = "FILE";
})(CheckFileExistsType = exports.CheckFileExistsType || (exports.CheckFileExistsType = {}));
