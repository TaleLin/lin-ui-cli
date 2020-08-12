## 介绍

Lin Mini Cli 是一款针对于 **微信小程序** 以及 **Lin UI** 的脚手架，通过 Lin Mini Cli 可以快速搭建一套带有 **按需加载** 功能和 **Lin UI** 组件库的项目模板。

## 特性

- 提供 `create` 命令，您可以通过此命令快速搭建一套项目模板
- 提供 `build` 命令，此命令可以实现 Lin UI  **按需加载** 功能
- 支持自动安装以及手动安装

## 快速上手

执行以下命令可以快速创建一个基于 Lin Mini Cli 的项目：

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

   此代码的主要是利用微信小程序自定义指令功能实现 **自动按需加载**

当进行完这五步操作后，即可等待项目创建完成。

当项目创建完成后，会返回如下提示语句：

```
Successfully created project lin-ui-demo, directory name is lin-ui-demo
Next: Please run cd lin-ui-demo && npm install or yarn
```

