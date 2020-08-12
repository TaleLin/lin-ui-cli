/**
 * @name 微信小程序页面/组件的json文件
 * @export
 * @interface PageJson
 */
export interface PageJson {
    component: boolean;
    usingComponents: any;
}
/**
 * @name 微信小程序app.json
 * @export
 * @interface AppJson
 */
export interface AppJson {
    pages: Array<string>;
    subPackages: Array<Subpackages>;
}
interface Subpackages {
    root: string;
    pages: Array<string>;
}
/**
 * @name 生成package.json需要输入的参数
 * @export
 * @interface PackageJsonInput
 */
export interface PackageJsonInput {
    name: string;
    version?: string;
    linuiversion: string;
    description?: string;
    cliversion: string;
}
/**
 * @name Prompt需要输入的参数
 * @export
 * @interface PromptInput
 */
export interface PromptInput {
    name: string;
    version: string;
    description: string;
    openLoading: boolean;
    appid: string;
}
export {};
