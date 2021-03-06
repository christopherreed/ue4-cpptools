const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const util = require('./util.js');

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
exports.getEditorCommand = getEditorCommand;
