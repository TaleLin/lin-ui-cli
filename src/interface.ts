/**
 * @name 微信小程序页面/组件的json文件
 * @export
 * @interface PageJson
 */
export interface PageJson {
    component: boolean,
    usingComponents: any
}

/**
 * @name 微信小程序app.json
 * @export
 * @interface AppJson
 */
export interface AppJson {
    pages: Array<string>,
    subPackages: Array<Subpackages>
}

interface Subpackages {
    root: string,
    pages: Array<string>
}

/**
 * @name 生成package.json需要输入的参数
 * @export
 * @interface PackageJsonInput
 */
export interface PackageJsonInput {
    name: string,
    version?: string,
    linuiversion: string,
    description?: string,
    cliversion: string,
    cliname: string
}

/**
 * @name Prompt需要输入的参数
 * @export
 * @interface PromptInput
 */
export interface PromptInput {
    name: string,
    version: string, 
    description: string, 
    openLoading: boolean,
    linVersion: string
}

/**
 * @name project.config.json
 * @export
 * @interface ProjectConfigInterface
 */
export interface ProjectConfigInterface {
    packOptions: PackOptions
}
/**
 * @name project.config.json PackOptions
 * @export
 * @interface PackOptions
 */
export interface PackOptions {
    ignore: Array<PackOptionsIgnore>
}
/**
 * @name project.config.json PackOptions PackOptionsIgnore
 * @export
 * @interface PackOptionsIgnore
 */
export interface PackOptionsIgnore {
    type: string,
    value: string
}