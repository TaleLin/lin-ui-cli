#!/usr/bin/env node
import program from 'commander'
import build from './build'
import create from './create'
program.version(require('../package.json')['version'], '-v, --version')
program.command('build')
    .action(build)
program.command('create <name>')
    .action(create)
program.parse(process.argv);