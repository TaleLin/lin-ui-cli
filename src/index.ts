#!/usr/bin/env node
import program from 'commander'
import build from './build'
import create from './create'
import { CLI_VERSION, CLI_NAME } from './config'
import { error, warn } from './tip-style'

/**
 * @name 未知参数错误提示
 * @param {string} methodName
 * @param {Function} log
 */
function enhanceErrorMessages(methodName: string, log: Function) {
    program.Command.prototype[methodName] = function (...args: any) {
        if (methodName === 'unknownOption' && this._allowUnknownOption) {
            return
        }
        this.outputHelp()
        console.log(`  ` + error(log(...args)))
        console.log()
        process.exit(1)
    }
}

program
    .version(CLI_VERSION, '-v, --version')
    .usage('<command> [options]')
program
    .command('load')
    .description('build lin ui of load on demand')
    .action(build)
program
    .command('create <name>')
    .usage('<name>')
    .description(`create a new project powered by ${CLI_NAME}`)
    .action(create)
// output help information on unknown commands
program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp()
        console.log()
        console.log(`  ` + `${error(`Unknown command ${warn(cmd)}`)}`)
        console.log()
    })

enhanceErrorMessages('missingArgument', (argName: string) => {
    console.log()
    return `${error(`Missing required argument ${warn(argName)}.`)}`
})
program.parse(process.argv);