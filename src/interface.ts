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
    subPackages:Array<Subpackages>
}

interface Subpackages {
    root: string,
    pages: Array<string>
}