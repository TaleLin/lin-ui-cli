"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linuiConfigContent = exports.projectConfigContent = exports.packageJsonContent = void 0;
function packageJsonContent({ name, version, linuiversion, description, cliversion, cliname }) {
    return `{
    "name": "${name}",
    "version": "${version}",
    "description": "${description}",
    "main": "app.js",
    "dependencies": {
        "lin-ui": "^${linuiversion}",
        "${cliname}: "^${cliversion}"
    },
    "devDependencies": {},
    "scripts": {
        "build": "${cliname} build"
    },
    "author": "",
    "license": "ISC"
}
`;
}
exports.packageJsonContent = packageJsonContent;
function projectConfigContent(isOpenLoading, linuiConfigName) {
    const scriptsContent = isOpenLoading ? `"scripts": {
        "beforeCompile": "npm run build",
        "beforePreview": "npm run build",
        "beforeUpload": "npm run build"
    },` : "";
    return `{
    "description": "项目配置文件",
    "packOptions": {
        "ignore": [{
            "type": "file",
            "value": "${linuiConfigName}"
        }]
    },
    "setting": {
        "urlCheck": true,
        "es6": true,
        "enhance": false,
        "postcss": true,
        "preloadBackgroundData": false,
        "minified": true,
        "newFeature": false,
        "coverView": true,
        "nodeModules": true,
        "autoAudits": false,
        "showShadowRootInWxmlPanel": true,
        "scopeDataCheck": false,
        "uglifyFileName": false,
        "checkInvalidKey": true,
        "checkSiteMap": true,
        "uploadWithSourceMap": true,
        "compileHotReLoad": false,
        "babelSetting": {
            "ignore": [],
            "disablePlugins": [],
            "outputPath": ""
        },
        "useIsolateContext": true,
        "useCompilerModule": false,
        "userConfirmedUseCompilerModuleSwitch": false
    },
    "compileType": "miniprogram",
    "libVersion": "2.12.1",
    "appid": "",
    "projectname": "lin-ui-template",
    "debugOptions": {
        "hidedInDevtools": []
    },
    ${scriptsContent}
    "isGameTourist": false,
    "simulatorType": "wechat",
    "simulatorPluginLibVersion": {},
    "condition": {
        "search": {
            "current": -1,
            "list": []
        },
        "conversation": {
            "current": -1,
            "list": []
        },
        "game": {
            "current": -1,
            "list": []
        },
        "plugin": {
            "current": -1,
            "list": []
        },
        "gamePlugin": {
            "current": -1,
            "list": []
        },
        "miniprogram": {
            "current": -1,
            "list": []
        }
    }
}`;
}
exports.projectConfigContent = projectConfigContent;
function linuiConfigContent(linuiDir, miniprogramDir) {
    return `{
    "lin-ui-dir": "${linuiDir}",
    "miniprogram_npm": "${miniprogramDir}"
}`;
}
exports.linuiConfigContent = linuiConfigContent;
