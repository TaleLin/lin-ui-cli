#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const build_1 = __importDefault(require("./build"));
const create_1 = __importDefault(require("./create"));
const config_1 = require("./config");
const tip_style_1 = require("./tip-style");
/**
 * @name 未知参数错误提示
 * @param {string} methodName
 * @param {Function} log
 */
function enhanceErrorMessages(methodName, log) {
    commander_1.default.Command.prototype[methodName] = function (...args) {
        if (methodName === 'unknownOption' && this._allowUnknownOption) {
            return;
        }
        this.outputHelp();
        console.log(`  ` + tip_style_1.error(log(...args)));
        console.log();
        process.exit(1);
    };
}
commander_1.default
    .version(config_1.CLI_VERSION, '-v, --version')
    .usage('<command> [options]');
commander_1.default
    .command('load')
    .description('build lin ui of load on demand')
    .action(build_1.default);
commander_1.default
    .command('create <name>')
    .usage('<name>')
    .description(`create a new project powered by ${config_1.CLI_NAME}`)
    .action(create_1.default);
// output help information on unknown commands
commander_1.default
    .arguments('<command>')
    .action((cmd) => {
    commander_1.default.outputHelp();
    console.log();
    console.log(`  ` + `${tip_style_1.error(`Unknown command ${tip_style_1.warn(cmd)}`)}`);
    console.log();
});
enhanceErrorMessages('missingArgument', (argName) => {
    console.log();
    return `${tip_style_1.error(`Missing required argument ${tip_style_1.warn(argName)}.`)}`;
});
commander_1.default.parse(process.argv);
