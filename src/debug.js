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

            // For these configurations we supply a top-level 'program' and 'type' and an overload per-platform - vscode gets confused otherwise, probably a bug
            launchConfigs.push({
                'name': `Attach Editor ${info.projectName} : DebugGame Editor`,
                'program' : launchCommand, // overloaded per platform
                'type':'cppdbg', // overloaded per platform
                'request': 'attach',
                'processId': '${command:pickProcess}',
                [currentSystem]: {
                    'program': launchCommand,
                    'type':launchType
                }
            });

            launchConfigs.push({
                'name':`Launch Editor ${info.projectName} : DebugGame Editor`,
                'program' : launchCommand, // overloaded per platform
                'type': 'cppdbg', // overloaded per platform
                'request': 'launch',
                'cwd': '${workspaceRoot}',
                [currentSystem] : {
                    'program': launchCommand,
                    'args' : launchArgs,
                    'type':launchType
                }
            });

            launchConfigs.push({
                'name':`Launch ${info.projectName} : DebugGame Editor`,
                'program' : launchCommand, // overloaded per platform
                'type': 'cppdbg', // overloaded per platform
                'request': 'launch',
                'cwd': '${workspaceRoot}',
                [currentSystem] : {
                    'program' : launchCommand,
                    'args' : launchArgs.concat('-game'),
                    'type':launchType
                }
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

                        if (!foundConfig[currentSystem]) {
                            foundConfig[currentSystem] = config[currentSystem];
                            updatedConfigs++;
                        } else {
                            skippedConfigs++;
                        }

                        return true; // break
                    }
                });
            
                if (createConfig) {
                    configurations.push(config);
                    updatedConfigs++;
                }
            });

            if (updatedConfigs > 0) {
                launchConfiguration.update('configurations', configurations);
            }

            if (skippedConfigs > 0) {
                vscode.window.showInformationMessage(`Generate Debug Configurations skipped overwriting ${skippedConfigs} configurations`)
            }
 
        });
    });
}
exports.generateDebugConfigurations = generateDebugConfigurations;