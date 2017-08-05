const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const util = require('./util.js');

function getUnrealBuildToolCommand(info) {
    return new Promise((resolve, reject) => {
        let engineRootPath = info.engineRootPath;

        if (!engineRootPath) {
            reject('Invalid or unset ue4-cpptools.engineRootPath');
        } else {
            let unrealBuildTool = path.join(engineRootPath, 'Engine', 'Binaries', 'DotNET', 'UnrealBuildTool.exe');
            
            fs.access(unrealBuildTool, (err) => {
                if (err) {
                    reject(`Faild to acces Unreal Build Tool '${unrealBuildTool}' : ${err}`);
                } else {
                    resolve(unrealBuildTool);
                }
            });
        }
    });
}

// Enclose string in quotes if it contains a space char
function fixStringWithSpaces(str) {
    if (str.includes(' ')) return `"${str}"`;
    return str;
}

function buildArgsString(args) {
    let commandStr = '';
    args.forEach((val) => {
        let str = ' ' + fixStringWithSpaces(val.toString());
        
        commandStr = commandStr.concat(str);
    });
    
    return commandStr;
}

function buildCommand(info, args) {
    let overrideUnrealBuildTool = info.overrideUnrealBuildTool;

    if (overrideUnrealBuildTool) {
        return Promise.resolve(overrideUnrealBuildTool + buildArgsString(args)); // don't format override
    }

    return new Promise((resolve, reject) => {
        getUnrealBuildToolCommand(info).then((command) => {
            if (process.platform == 'linux' || process.platform == 'mac') {
                // Linux and Mac requires us to prepend 'mono'
                args.unshift(command);
                command = 'mono';
            } else {
                let terminal = vscode.workspace.getConfiguration().terminal.integrated.shell.windows;
                if (terminal && terminal.endsWith('powershell.exe')) {
                    // powershell requires us to prepend the call operator '&' to run commands not in cwd or on path
                    args.unshift(command);
                    command = '&';
                }
            }

            resolve(fixStringWithSpaces(command) + buildArgsString(args));
        },
        (err) => reject(err));
    });
}

function runBuildTool(info, args, taskName) {
    return buildCommand(info, args).then((command) => {
        let terminal = util.findTerminal(taskName);
        terminal.show();
        terminal.sendText(command);
    });
}


function hotReloadProject() {
    util.getProjectInfo().then((info) => {
        let platformArgs = [];

        let buildPlatforms = {
            'linux' : 'Linux',
            'win32' : 'Win64',
            'darwin' : 'Mac'
        };
        let buildPlatform = buildPlatforms[process.platform];

        let rand = Math.floor(Math.random() * (22222 - 22 + 1)) + 22; // completely arbitrary ranges here

        let args = [
            info.projectName,
            '-ModuleWithSuffix',
            info.projectName,
            rand,
            buildPlatform,
            'Development',
            '-editorrecompile',
            '-canskiplink',
            info.projectFilePath
        ];

        runBuildTool(info, args, 'ue4-cpptools:HotReloadProject').then(
            (ok) => {},
            (err) => {vscode.window.showErrorMessage(`${err}`);}    
        );
    });
}
exports.hotReloadProject = hotReloadProject;

function buildProject() {
    util.getProjectInfo().then((info) => {
        let platformArgs = [];

        let buildPlatforms = {
            'linux' : 'Linux',
            'win32' : 'Win64',
            'darwin' : 'Mac'
        };
        let buildPlatform = buildPlatforms[process.platform];

        let buildConfiguration = info.buildConfiguration || 'Development';
        let buildTarget = 'Editor'

        let args = [
            info.projectName + buildTarget,
            buildPlatform,
            buildConfiguration,
            info.projectFilePath
        ];

        runBuildTool(info, args, 'ue4-cpptools:BuildProject').then(
            (ok) => {},
            (err) => {vscode.window.showErrorMessage(`${err}`);}    
        );
    });
}
exports.buildProject = buildProject;

function generateProjectFiles() {
    var generateNativeProjectFiles = true; // TODO setting

    util.getProjectInfo().then((info) => {
        let platformArgs = [];

        if (generateNativeProjectFiles) {
            let nativeProjectFiles = {
                'linux' : ['-makefile'],
                'win32' : ['-projectfile'],
                'darwin' : ['xcodeprojectfile']
            };

            platformArgs = nativeProjectFiles[process.platform];
        }

        let args = platformArgs.concat([
            '-codelitefile',
            '-project=',
            info.projectFilePath,
            '-game',
            '-engine'
        ]);

        runBuildTool(info, args, 'ue4-cpptools:GenerateProjectFiles').then(
            (ok) => {},
            (err) => {vscode.window.showErrorMessage(`${err}`);}    
        );
    });
}
exports.generateProjectFiles = generateProjectFiles;