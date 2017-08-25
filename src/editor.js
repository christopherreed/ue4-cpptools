const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const util = require('./util.js');
const terminal = require('./terminal.js');

function getUnrealEditorCommand(info) {
    return new Promise((resolve, reject) => {
        let engineRootPath = info.engineRootPath;

        if (!engineRootPath) {
            reject('Invalid or unset ue4-cpptools.engineRootPath');
        } else {
            let platformPaths = {
                'linux' : 'Linux',
                'win32' : 'Win64',
                'darwin' : 'Mac'
            };
            let platformPath = platformPaths[process.platform];

            let executablePaths = {
                'linux' : 'UE4Editor',
                'win32' : 'UE4Editor.exe',
                'darwin' : 'UE4Editor.app'
            };
            let executable = executablePaths[process.platform];

            let unrealEditor = path.join(engineRootPath, 'Engine', 'Binaries', platformPath, executable);
            
            fs.access(unrealEditor, (err) => {
                if (err) {
                    reject(`Failed to access Unreal Editor '${unrealEditor}' : ${err}`);
                } else {
                    resolve(unrealEditor);
                }
            });
        }
    });
}

function getEditorCommand(info, args) {
    return new Promise((resolve, reject) => {
        let overrideUnrealEditor = info.overrideUnrealEditor;
        
        if (overrideUnrealEditor) {
            resolve({'command':overrideUnrealEditor, 'args':args});
        } else {
            getUnrealEditorCommand(info).then((command) => {
                if (process.platform == 'darwin') {
                    // untested
                    args.unshift('--args');
                    args.unshift(command);
                    command = 'open';
                }
                
                resolve({'command':command, 'args':args});
            }, (err) => {
                reject(err);
            });
        }
    });
}

function launchEditor(info, args) {
    return new Promise((resolve, reject) => {
        getEditorCommand(info, args).then((command) => {
            terminal.execCommandInProcess(command.command, command.args).then((ok) => {
                resolve();
            }, (err) => {
                reject(`Failed to launch editor : Exited with error code ${err}`);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

function openProjectWithEditor() {
    util.getProjectInfo().then((info) => {
        let args = [
            info.projectFilePath
        ];

        let buildConfiguration = info.buildConfiguration;
        
        // These are the only valid build configurations to open with editor, default to DebugGame if it is the current buildConfiguration
        let items = ['Development', 'DebugGame'];
        if (buildConfiguration == 'DebugGame') {
            items = ['DebugGame', 'Development'];
        } 
        
        vscode.window.showQuickPick(items, {'placeHolder' : 'Select build configuration to open with Unreal Editor'}).then((selected) => {
            if (selected) {
                if (selected == 'DebugGame') {
                    args.push('-debug');
                }
        
                launchEditor(info, args).catch((err) => {
                    vscode.window.showErrorMessage(`Failed to open project with editor : ${err}`);
                });
            }
        }); 
    });
}
exports.openProjectWithEditor = openProjectWithEditor;

function runProjectWithEditor() {
    util.getProjectInfo().then((info) => {
        let args = [
            info.projectFilePath,
            '-game'
        ];

        let buildConfiguration = info.buildConfiguration;

        // These are the only valid build configurations to run with editor, default to DebugGame if it is the current buildConfiguration
        let items = ['Development', 'DebugGame'];
        if (buildConfiguration == 'DebugGame') {
            items = ['DebugGame', 'Development'];
        } 
        
        vscode.window.showQuickPick(items, {'placeHolder' : 'Select build configuration to run with Unreal Editor'}).then((selected) => {
            if (selected) {
                if (selected == 'DebugGame') {
                    args.push('-debug');
                }
        
                launchEditor(info, args).catch((err) => {
                    vscode.window.showErrorMessage(`Failed to run project with editor : ${err}`);
                });
            }
        }); 
    });
}
exports.runProjectWithEditor = runProjectWithEditor;
