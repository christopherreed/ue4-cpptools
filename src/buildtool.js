const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const util = require('./util.js');
const command = require('./command.js');

function getUnrealBuildToolCommand(info) {
    return new Promise((resolve, reject) => {
        let engineRootPath = info.engineRootPath;

        if (!engineRootPath) {
            reject('Invalid or unset ue4-cpptools.engineRootPath');
        } else {
            let unrealBuildTool = path.join(engineRootPath, 'Engine', 'Binaries', 'DotNET', 'UnrealBuildTool.exe');
            
            fs.access(unrealBuildTool, (err) => {
                if (err) {
                    reject(`Failed to access Unreal Build Tool '${unrealBuildTool}' : ${err}`);
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
                if (process.platform == 'linux' || process.platform == 'darwin') {
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
exports.getBuildCommand = getBuildCommand;

function getBuildProjectArgs(info, buildConfiguration, buildConfigurationTarget, buildPlatform) {
    if (!buildPlatform) {
        let buildPlatforms = {
            'linux' : 'Linux',
            'win32' : 'Win64',
            'darwin' : 'Mac'
        };
        buildPlatform = buildPlatforms[process.platform];
    }

    if(!buildConfiguration) {
        buildConfiguration = 'Development';
    }

    if (!buildConfigurationTarget) {
        buildConfigurationTarget = 'Editor';
    } else if (buildConfigurationTarget == 'Game') { // For forcing the 'empty' stand-alone target
        buildConfigurationTarget = '';
    }
    
    let args = [
        info.projectName + buildConfigurationTarget,
        buildPlatform,
        buildConfiguration,
        info.projectFilePath,
        '-waitmutex'
    ];

    return args;
}
exports.getBuildProjectArgs = getBuildProjectArgs;

function getGenerateProjectFilesArgs(info, generateNativeProjectFiles=true, generateCodeLiteProjectFiles=false, generateEngineProjectFiles=true) {
    let args = [];

    if (generateNativeProjectFiles) {
        let nativeProjectFiles = { // TODO setting ue4-cpptool.nativeProjectFiles
            'linux' : ['-makefile', '-kdevelopfile', '-qmakefile', '-cmakefile', '-codelitefile'],
            'win32' : ['-projectfiles'],
            'darwin' : ['-xcodeprojectfile']
        };

        args = args.concat(nativeProjectFiles[process.platform]);
    }

    if (generateCodeLiteProjectFiles) {
        if (!args.find((v) => {return v == '-codelitefile'})) args.push('-codelitefile');
    }

    args = args.concat([
        '-project=',
        info.projectFilePath,
        '-game',
        '-rocket',
        '-waitmutex'
    ]);

    if (generateEngineProjectFiles) {
        args.push('-engine');
    }

    return args;
}
exports.getGenerateProjectFilesArgs = getGenerateProjectFilesArgs;

function execGenerateProjectFilesProcess(generateNativeProjectFiles=false, generateCodeLiteProjectFiles=false, generateEngineProjectFiles=false) {
    return new Promise((resolve, reject) => {
        util.getProjectInfo().then((info) => {
            let args = getGenerateProjectFilesArgs(info, generateNativeProjectFiles, generateCodeLiteProjectFiles, generateEngineProjectFiles);
            
            getBuildCommand(info, args).then((buildCommand) => {
                command.execCommandInProcess(buildCommand.command, buildCommand.args).then(
                (ok) => {
                    resolve();
                },(err) => {
                    reject(`Failed to generate project files : Exited with error code ${err}`);
                });
            }).catch((err) => {
                reject(err);
            });
        }); 
    });
}
exports.execGenerateProjectFilesProcess = execGenerateProjectFilesProcess;