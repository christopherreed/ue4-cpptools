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
        
        if (buildConfiguration == 'DebugGame') {
            args.push('-debug');
            vscode.window.showInformationMessage(`Opening project build 'DebugGame', your current build configuration`);
        } else if (buildConfiguration != 'Development') {
            vscode.window.showWarningMessage(`Opening project build 'Development', not your current build configuration '${buildConfiguration}'`);
        }

        launchEditor(info, args).catch((err) => {
            vscode.window.showErrorMessage(`Failed to open project with editor : ${err}`);
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

        if (buildConfiguration == 'DebugGame') {
            args.push('-debug');
            vscode.window.showInformationMessage(`Running project build 'DebugGame', your current build configuration`);
        } else if (buildConfiguration != 'Development') {
            vscode.window.showWarningMessage(`Running project build 'Development', not your current build configuration '${buildConfiguration}'`);
        }
        
        launchEditor(info, args).catch((err) => {
            vscode.window.showErrorMesage(`Failed to run project with editor : ${err}`);
        });
    });
}
exports.runProjectWithEditor = runProjectWithEditor;

function searchOnlineDocumentation() {
    let query = 'https://docs.unrealengine.com/latest/INT/Programming/Introduction/';
    if (vscode.window.activeTextEditor) {
        let selection = vscode.window.activeTextEditor.selection;
        if (selection && !selection.isEmpty) {
            let selectionText = vscode.window.activeTextEditor.document.getText(selection);
            if (!selectionText.includes(' ')) {
                query = selectionText;
            }
        } 
    }

    vscode.window.showInputBox({'prompt':'Search Unreal Engine Online Documentation', 'value':query}).then((query) => {
        if (query) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.unrealengine.com/bing-search?keyword=${query}`));
        }
    });
}
exports.searchOnlineDocumentation = searchOnlineDocumentation;
