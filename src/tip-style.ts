import chalk from 'chalk'
import consola from 'consola'

// tip type
export const Success = (content: any) => consola.success(content)
export const Error = (content: any) => consola.error(content)
export const Start = (content: any) => consola.start(content)
export const Warn = (content: any) => consola.warn(content)
// tip style
export const success = (content: any) => chalk.greenBright(content)
export const error = (content: any) => chalk.redBright(content)
export const primary = (content: any) => chalk.blueBright(content)
export const warn = (content: any) => chalk.yellowBright(content)
