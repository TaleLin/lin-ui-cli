## 介绍

`lin-mini-cli` 是一款针对于 **微信小程序** 以及 `lin-ui` 的脚手架，通过 `lin-mini-cli` 可以快速搭建一套带有 **按需加载** 功能和 `lin-ui` 组件库的项目模板。

## 特性

- 提供 `create` 命令，用户可以通过此命令快速搭建一套项目模板
- 提供 `build` 命令，此命令可以实现微信小程序 **按需加载** 功能
- 支持自动安装以及手动安装
- 利用微信小程序自定义指令功能，实现无痛打包

## 快速上手

### 自动安装（推荐）

执行以下命令可以快速创建一个基于 `lin-mini-cli` 的项目：

```bash
npx lin-mini-cli create lin-ui-demo
```

此命令会有以下 `prompts`：

1. `name` ：项目名称（ `package.json` 文件内 `name` 字段 ），默认为 `create` 命令后的 `name`

2. `version` ：项目版本号，默认为 `1.0.0`

3. `description` ：项目介绍，默认为空

4. `appid` ：微信小程序 `appid`

5. `是否开启按需加载` ：当输入 `yes` 后，生成的文件[`project.config.json` （微信小程序配置文件）](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html) 内会携带以下代码：

   ```javascript
   "scripts": {
     "beforeCompile": "npm run build",
     "beforePreview": "npm run build",
     "beforeUpload": "npm run build"
   }
   ```

   此代码的主要是利用微信小程序自定义指令功能实现 **无痛按需加载**

当进行完这五步操作后，即可等待项目创建完成。

当项目创建完成后，会返回如下提示语句：

```
Successfully created project lin-ui-demo, directory name is lin-ui-demo
Next: Please run cd lin-ui-demo && npm install or yarn
```

使用 `create` 命令创建的项目默认携带 `linui.config.json` 文件，此文件为脚手架配置文件，此配置文件有以下配置：

- `miniprogram_npm` ：配置 `miniprogram_npm` 的文件夹名称，默认值  `miniprogram_npm` 
- `lin-ui-dir` ： 配置 `miniprogram_npm` 下 `lin-ui` 组件库文件夹的名称，默认值 `lin-ui`

绝大部份情况下，此配置文件的配置内容无需任何更改，除非您修改了微信小程序 `npm` 构建的默认文件夹名称，当然如果您认为不需要此文件，您也可以删除，我们在脚手架内部已内置与微信小程序相同的默认配置。

在生成的微信小程序配置文件 `project.config.json` 文件中，我们已默认配置如下代码，用来防止微信小程序打包配置文件 `linui.config.json`：

```javascript
"packOptions": {
    "ignore": [{
        "type": "file",
        "value": "linui.config.json"
    }]
}
```



### 手动安装

首先，您在进行此操作前需要创建一个微信小程序项目，并在 **本地设置** 中勾选 `使用npm模块` 选项。

打开小程序的项目根目录，执行下面的命令（如果使用了云开发，需要进入miniprogram文件夹下执行下面的命令）。

```sh
npm init
```

此时，会生成一个package.json文件，命令行里会以交互的形式让你填一些项目的介绍信息，你可以耐心填完，当然也可以忽略，全部按回车键来快速完成项目初始化。

::: tip 注意事项

- 1.执行npm init进行初始化，此时会生成一个package.json文件，如果不进行npm init，在构建npm的时候会报一个错误：`没有找到 node_modules 目录`

- 2.不建议使用cnpm，这样会带来一些未知的错误。如果网络情况不佳，可以使用下面的命令行更换为淘宝源。

```bash
npm config set registry https://registry.npm.taobao.org 
```

:::

接着，继续执行下面的命令。
```sh
npm install lin-ui lin-mini-cli
```

or

```sh
yarn add lin-ui lin-mini-cli
```

执行成功后，会在根目录里生成项目依赖文件夹 `node_modules/lin-ui` （小程序IDE的目录结构里不会显示此文件夹）。
<br/>
然后用小程序官方IDE打开我们的小程序项目，找到 `工具` 选项，点击下拉选中 `构建npm` ，等待构建完成即可。

<img-wrapper>
  <img src="http://imglf6.nosdn0.126.net/img/YUdIR2E3ME5weEZEa3ErKzdJRGVNckFIWUZrS0ZKeWNOUnpxSXh5MlRKQU9Jakh6WnRXenVRPT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0">
</img-wrapper>
出现上图所示的结果后，可以看到小程序IDE工具的目录结构里多出了一个文件夹 `miniprogram_npm`（之后所有通过 `npm ` 引入的组件和 `js` 库都会出现在这里），打开后可以看到 `lin-ui` 文件夹，也就是我们所需要的组件。

<img-wrapper>
  <img src="http://imglf5.nosdn0.126.net/img/YUdIR2E3ME5weEVCVEZMbkRGRHZaRWdTWE9UMzd1Y3ZkN2dHUjBHY2xSS1daZjl0QTkvOVVBPT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0">
</img-wrapper>

:::tip

构建这一步可以忽略，因为接下来的配置会自动生成此目录

:::

接下来，在 `package.json` 文件里写入以下代码：

```javascript
"scripts": {
    "build": "lin-mini-cli build"
},
```

在微信小程序配置文件 `project.config.json` 文件里写入以下代码：

```javascript
"scripts": {
    "beforeCompile": "npm run build",
    "beforePreview": "npm run build",
    "beforeUpload": "npm run build"
}
```

到此 `lin-mini-cli` 脚手架已经安装完成，当然您可以选择在项目创建 `linui.config.json` 配置文件，具体参数如下。

## linui.config.json (Attributes）

| 参数            | 说明                                                       | 类型   | 可选值 | 默认值          |
| :-------------- | :--------------------------------------------------------- | :----- | :----- | :-------------- |
| miniprogram_npm | 配置 `miniprogram_npm` （小程序执行构建npm后）的文件夹名称 | String | -      | miniprogram_npm |
| lin-ui-dir      | 配置 `miniprogram_npm` 下 `lin-ui` 组件所在文件夹名称      | String | -      | lin-ui          |

