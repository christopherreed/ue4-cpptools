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
        let workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || !workspaceFolders[0]) {
            reject('No workspace folder open');
            return;
        }

        let uri = workspaceFolders[0].uri;
        if (!uri || !uri.fsPath) {
            reject('Invalid workspace folder path');
            return;
        }
        
        let projectPath = uri.fsPath;

        let projectName = projectPath.slice(projectPath.lastIndexOf(path.sep) + 1);
        if (!projectName || projectName.length < 1) {
            reject('Failed to retrieve project name');
            return;
        }

        let projectFileName = projectName + '.uproject';

        let projectFilePath = path.join(projectPath, projectFileName);

        let engineRootPath = vscode.workspace.getConfiguration('ue4-cpptools').get('engineRootPath') || process.env.UE4_ENGINE_ROOT_PATH;
        
        let cppToolsConfiguration = vscode.workspace.getConfiguration('ue4-cpptools').get('cppToolsConfiguration');

        let overrideUnrealBuildTool = vscode.workspace.getConfiguration('ue4-cpptools').get('overrideUnrealBuildTool');

        let buildConfiguration = vscode.workspace.getConfiguration('ue4-cpptools').get('buildConfiguration') || 'Development';
        
        let buildConfigurationTarget = vscode.workspace.getConfiguration('ue4-cpptools').get('buildConfigurationTarget') || 'Editor';

        let buildPlatform = vscode.workspace.getConfiguration('ue4-cpptools').get('buildPlatform');
        if (!buildPlatform) {
            let buildPlatforms = {
                'linux' : 'Linux',
                'win32' : 'Win64',
                'darwin' : 'Mac'
            };
            buildPlatform = buildPlatforms[process.platform]; 
        }
        
        let overrideUnrealEditor = vscode.workspace.getConfiguration('ue4-cpptools').get('overrideUnrealEditor');

        let info = {
            'projectPath' : projectPath,
            'projectName' : projectName,
            'projectFilePath' : projectFilePath,
            'engineRootPath' : engineRootPath,

            'cppToolsConfiguration' : cppToolsConfiguration,

            'overrideUnrealBuildTool' : overrideUnrealBuildTool,

            'buildConfiguration' : buildConfiguration,

            'buildConfigurationTarget' : buildConfigurationTarget,

            'buildPlatform' : buildPlatform,

            'overrideUnrealEditor' : overrideUnrealEditor
        };

        resolve(info);
    });
}
exports.getProjectInfo = getProjectInfo;

function showIndicator(title, duration=2500) {
    return vscode.window.withProgress({'title':title, 'location':vscode.ProgressLocation.Window}, (progress) => {
        return new Promise((resolve) => {
            setInterval(() => {
                resolve();
            }, duration);
        });
    });
}
exports.showIndicator = showIndicator;