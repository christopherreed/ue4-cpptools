const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const util = require('./util.js');

function getUnrealBuildToolCommand(info, args) {
    return new Promise((resolve, reject) => {
        let overrideUnrealBuildTool = info.overrideUnrealBuildTool;
       
        if (!overrideUnrealBuildTool) {
            let engineRootPath = info.engineRootPath;

            if (!engineRootPath) {
                reject('Invalid or unset ue4-cpptools.engineRootPath');
                return;
            }
            
            args.unshift(path.join(engineRootPath, 'Engine', 'Binaries', 'DotNET', 'UnrealBuildTool.exe'));

            if (process.platform == 'linux' || process.platform == 'mac') {
                // Linux and Mac requires us to prepend 'mono'
                args.unshift('mono');
            } else {
                let terminal = vscode.workspace.getConfiguration().terminal.integrated.shell.windows;
                if (terminal && terminal.endsWith('powershell.exe')) {
                    // powershell requires us to prepend the call operator '&' to run commands not in cwd or on path
                    args.unshift('&');
                }
            }
        }

        // concat command and args to a single string, any element that includes a space should be enclosed in quotes
        let commandStr = overrideUnrealBuildTool || '';
        args.forEach((val) => {
            let str = val.toString();
            if (str.includes(' ')) {
                commandStr = commandStr.concat(` \"${val}\"`);
            } else {
                commandStr = commandStr.concat(` ${val}`);
            }
        });

        resolve(commandStr);      
    });
}

function runCommandInTerminal(command, terminalName) {
    util.findTerminal(terminalName)
    .then((term) => {
        term.show();
        term.sendText(command);
    }); 
}

function runBuildTool(info, args, terminalName) {
    return new Promise((resolve, reject) => {
        getUnrealBuildToolCommand(info, args).then(
            command => {
                runCommandInTerminal(command, terminalName);
                resolve();
            },
            err => {
                reject(err)
            }
        );
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
            (err) => {console.error(err);}    
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
            (err) => {console.error(err);}    
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
            (err) => {console.error(err);}    
        );
    });
}
exports.generateProjectFiles = generateProjectFiles;