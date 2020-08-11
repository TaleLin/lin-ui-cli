#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const build_1 = __importDefault(require("./build"));
const create_1 = __importDefault(require("./create"));
commander_1.default.version(require('../package.json')['version'], '-v, --version');
commander_1.default.command('build')
    .action(build_1.default);
commander_1.default.command('create <name>')
    .action(create_1.default);
commander_1.default.parse(process.argv);
