#!/usr/bin/env node
import program from 'commander'
import build from './build'

//version 版本号
//name 新项目名称
program.version(require('../package.json')['version'], '-v, --version')
program.command('build')
    .action(build)
program.parse(process.argv);