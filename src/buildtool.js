const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const util = require('./util.js');
const terminal = require('./terminal.js');

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

function getBuildCommand(info, args) {
    return new Promise((resolve, reject) => {
        let overrideUnrealBuildTool = info.overrideUnrealBuildTool;
        
        if (overrideUnrealBuildTool) {
            resolve({'command':overrideUnrealBuildTool, 'args':args});
        } else {
            getUnrealBuildToolCommand(info).then((command) => {
                if (process.platform == 'linux' || process.platform == 'mac') {
                    // Linux and Mac requires us to prepend 'mono'
                    args.unshift(command);
                    command = 'mono';
                }
    
                resolve({'command':command, 'args':args});
            }, (err) => {
                reject(err);
            });
        }
    });
}

function runBuildTool(info, args, taskName) {
    getBuildCommand(info, args).then((command) => {
        terminal.runCommandInTerminal(command.command, command.args, taskName);
    }, (err) => {
        vscode.window.showErrorMessage(`${err}`);
    });
}

function hotReloadProjectArgs(info) {
    let rand = Math.floor(Math.random() * (22222 - 22 + 1)) + 22; // completely arbitrary ranges here

    let args = [
        info.projectName,
        '-ModuleWithSuffix',
        info.projectName,
        rand,
        info.buildPlatform,
        'Development',
        '-editorrecompile',
        '-canskiplink',
        info.projectFilePath
    ];

    return args;
}

function hotReloadProject() {
    util.getProjectInfo().then((info) => {
        let args = hotReloadProjectArgs(info);
        
        runBuildTool(info, args, 'ue4-cpptools:HotReloadProject');  
    });
}
exports.hotReloadProject = hotReloadProject;

function buildProjectArgs(info) {
    let buildConfigurationTarget = info.buildConfigurationTarget;
    if (!buildConfigurationTarget || buildConfigurationTarget == 'Game') {
        buildConfigurationTarget = '';
    }
    
    let args = [
        info.projectName + buildConfigurationTarget,
        info.buildPlatform,
        info.buildConfiguration,
        info.projectFilePath
    ];

    return args;
}

function buildProject() {
    util.getProjectInfo().then((info) => {
        let args = buildProjectArgs(info);
        
        runBuildTool(info, args, 'ue4-cpptools:BuildProject');  
    });
}
exports.buildProject = buildProject;

function generateProjectFilesArgs(info, generateNativeProjectFiles=true) {
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

    return args;
}

function generateProjectFiles() {
    util.getProjectInfo().then((info) => {
        let args = generateProjectFilesArgs(info);
        
        runBuildTool(info, args, 'ue4-cpptools:GenerateProjectFiles');  
    });
}
exports.generateProjectFiles = generateProjectFiles;