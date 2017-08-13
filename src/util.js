const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function touchDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
        let dir = path.normalize(directoryPath);

        fs.mkdir(dir, (err) => {
            if (err && err.code !== 'EEXIST') {
                reject(`Failed to touch directory '${path}' : ${err.code}`);
            } else {
                resolve(dir);
            }
        });
    });
}
exports.touchDirectory = touchDirectory;

function getProjectInfo() {
    return new Promise((resolve, reject) => {
        let projectPath = vscode.workspace.rootPath;
        if (!projectPath) {
            reject('No vscode workspace');
            return;
        }

        let projectName = projectPath.slice(projectPath.lastIndexOf(path.sep) + 1);
        if (!projectName || projectName.length < 1) {
            reject('Failed to retrieve project name');
            return;
        }

        let projectFileName = projectName + '.uproject';

        let projectFilePath = path.join(projectPath, projectFileName);

        let engineRootPath = vscode.workspace.getConfiguration('ue4-cpptools').get('engineRootPath') || process.env.UE4_ENGINE_ROOT_PATH;
        
        let configurationName = vscode.workspace.getConfiguration('ue4-cpptools').get('configurationName');

        let overrideUnrealBuildTool = vscode.workspace.getConfiguration('ue4-cpptools').get('overrideUnrealBuildTool');

        let buildConfiguration = vscode.workspace.getConfiguration('ue4-cpptools').get('buildConfiguration');

        let info = {
            'projectPath' : projectPath,
            'projectName' : projectName,
            'projectFilePath' : projectFilePath,
            'engineRootPath' : engineRootPath,

            'configurationName' : configurationName,

            'overrideUnrealBuildTool' : overrideUnrealBuildTool,

            'buildConfiguration' : buildConfiguration
        };

        resolve(info);
    });
}
exports.getProjectInfo = getProjectInfo;