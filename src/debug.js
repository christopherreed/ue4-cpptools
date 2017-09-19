const vscode = require('vscode');
const util = require('./util.js');
const editor = require('./editor.js');

function generateDebugConfigurations() {
    util.getProjectInfo().then((info) => {
        let systemLiterals = {
            'linux' : 'linux',
            'win32' : 'windows',
            'darwin' : 'osx'
        };
        let currentSystem = systemLiterals[process.platform];

        let args = [
            info.projectFilePath,
            '-debug'
        ];

        editor.getEditorCommand(info, args).then((command) => {
            let launchCommand = command.command;
            let launchArgs = command.args;
            let launchConfigs = [];
            let launchType = (currentSystem == 'windows') ? 'cppvsdbg' : 'cppdbg';

            launchConfigs.push({
                'name': `${info.configurationName} : Attach Editor ${info.projectName} [DebugGame Editor]`,
                'program' : launchCommand,
                'type': launchType,
                'request': 'attach',
                'processId': '${command:pickProcess}'
            });

            launchConfigs.push({
                'name':`${info.configurationName} : Launch Editor ${info.projectName} [DebugGame Editor]`,
                'program' : launchCommand,
                'type':launchType,
                'args' : launchArgs,
                'request': 'launch',
                'cwd': '${workspaceRoot}'                
            });

            launchConfigs.push({
                'name':`${info.configurationName} : Launch ${info.projectName} [DebugGame Editor]`,
                'program' : launchCommand,
                'type':launchType,
                'args' : launchArgs.concat('-game'),
                'request': 'launch',
                'cwd': '${workspaceRoot}'
            });

            let launchConfiguration = vscode.workspace.getConfiguration('launch');

            if (!launchConfiguration.has('version')) launchConfiguration.update('version', '0.2.0');

            let configurations = launchConfiguration.get('configurations') || [];

            let skippedConfigs = 0;
            let updatedConfigs = 0;

            launchConfigs.forEach((config) => {
                let createConfig = true;

                configurations.forEach((foundConfig) => {
                    if (foundConfig.name && config.name == foundConfig.name) {
                        createConfig = false;

                        return true; // break
                    }
                });
            
                if (createConfig) {
                    configurations.push(config);
                    updatedConfigs++;
                } else {
                    skippedConfigs++;
                }
            });

            if (updatedConfigs > 0) {
                launchConfiguration.update('configurations', configurations);
            }

            if (skippedConfigs > 0) {
                vscode.window.showInformationMessage(`Generate Debug Configurations skipped overwriting ${skippedConfigs} configurations`);
            }
 
        });
    });
}
exports.generateDebugConfigurations = generateDebugConfigurations;