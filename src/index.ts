#!/usr/bin/env node
import program from 'commander'
import build from './build'
import create from './create'
import { CLI_VERSION } from './config'
program.version(CLI_VERSION, '-v, --version')
program.command('build')
    .action(build)
program.command('create <name>')
    .action(create)
program.parse(process.argv);