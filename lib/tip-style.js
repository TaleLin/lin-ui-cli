"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = exports.primary = exports.error = exports.success = exports.Warn = exports.Start = exports.Error = exports.Success = void 0;
const chalk_1 = __importDefault(require("chalk"));
const consola_1 = __importDefault(require("consola"));
// tip type
exports.Success = (content) => consola_1.default.success(content);
exports.Error = (content) => consola_1.default.error(content);
exports.Start = (content) => consola_1.default.start(content);
exports.Warn = (content) => consola_1.default.warn(content);
// tip style
exports.success = (content) => chalk_1.default.greenBright(content);
exports.error = (content) => chalk_1.default.redBright(content);
exports.primary = (content) => chalk_1.default.blueBright(content);
exports.warn = (content) => chalk_1.default.yellowBright(content);
