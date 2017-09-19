const vscode = require('vscode');
const util = require('./util.js');
const buildtool = require('./buildtool.js');
const editor = require('./editor.js');

function getGenerateProjectFilesTasks(info, currentSystem) {
    return new Promise((resolve, reject) => {
        // Generate project files tasks
        let tasks = [];
        
        let args = buildtool.getGenerateProjectFilesArgs(info, true, false, true);
        buildtool.getBuildCommand(info, args).then((projectFilesCommand) => {
            tasks.push({
                'taskName' : `Generate ${info.projectName} Project Files`,
                'type' : 'process',
                [currentSystem] : {
                    'command' : projectFilesCommand.command,
                    'args' : projectFilesCommand.args
                }
            });

            resolve(tasks);
        }).catch((err) => {
          throw(err);  
        });
    });
}

function getBuildTasks(info, buildConfiguration, buildConfigurationTarget, currentSystem) {
    return new Promise((resolve, reject) => {
        // Build, clean, and rebuild tasks for the build configuration matrix
        let tasks = [];
    
        let args = buildtool.getBuildProjectArgs(info, buildConfiguration, buildConfigurationTarget)    
        buildtool.getBuildCommand(info, args).then((buildCommand) => {
            let buildTaskName = `Build ${info.projectName} : ${buildConfiguration} ${buildConfigurationTarget}`;
            let cleanTaskName = `Clean ${info.projectName} : ${buildConfiguration} ${buildConfigurationTarget}`;
            let rebuildTaskName = `Rebuild ${info.projectName} : ${buildConfiguration} ${buildConfigurationTarget}`;

            tasks.push({
                'taskName' : buildTaskName,
                'type' : 'process',
                'group' : 'build',
                [currentSystem] : {
                    'command' : buildCommand.command,
                    'args' : buildCommand.args
                }
            });

            tasks.push({
                'taskName' : cleanTaskName,
                'type' : 'process',
                'group' : 'build',
                [currentSystem] : {
                    'command' : buildCommand.command,
                    'args' : buildCommand.args.concat(['-clean'])
                }
            });

            tasks.push({
                'taskName' : rebuildTaskName,
                'group' : 'build',
                'dependsOn' : [
                    cleanTaskName,
                    buildTaskName
                ]
            });

            resolve(tasks);
        }).catch((err) => {
            throw(err);
        });
    });
}

function getEditorTasks(info, currentSystem) {
    return new Promise((resolve, reject) => {
        // Launch, open, and run tasks
        let tasks = [];
        let args = [];
        editor.getEditorCommand(info, args).then((command) => {
            tasks.push({
                'taskName' : 'Launch Unreal Editor',
                'type' : 'process',
                [currentSystem] : {
                    'command' : command.command,
                    'args' : command.args
                }
            });

            tasks.push({
                'taskName' : `Open ${info.projectName} With Editor [Development Editor]`,
                'type' : 'process',
                [currentSystem] : {
                    'command' : command.command,
                    'args' : command.args.concat(info.projectFilePath)
                }
            });

            tasks.push({
                'taskName' : `Open ${info.projectName} With Editor [DebugGame Editor]`,
                'type' : 'process',
                [currentSystem] : {
                    'command' : command.command,
                    'args' : command.args.concat([info.projectFilePath, '-debug'])
                }
            });

            tasks.push({
                'taskName' : `Run ${info.projectName} With Editor [Development Editor]`,
                'type' : 'process',
                [currentSystem] : {
                    'command' : command.command,
                    'args' : command.args.concat([info.projectFilePath, '-game'])
                }
            });

            tasks.push({
                'taskName' : `Run ${info.projectName} With Editor [DebugGame Editor]`,
                'type' : 'process',
                [currentSystem] : {
                    'command' : command.command,
                    'args' : command.args.concat([info.projectFilePath, '-game', '-debug'])
                }
            });

            resolve(tasks);
        }).catch((err) => {
            throw(err);
        })   
    });
}

function generateTaskConfigurations() {
    let systemLiterals = {
        'linux' : 'linux',
        'win32' : 'windows',
        'darwin' : 'osx'
    };
    let currentSystem = systemLiterals[process.platform];

    util.getProjectInfo().then((info) => {
        let generatedTasksGlob = [];

        generatedTasksGlob.push(getGenerateProjectFilesTasks(info, currentSystem));
        generatedTasksGlob.push(getEditorTasks(info, currentSystem));

        let buildConfigurations = ['Development', 'DebugGame'];
        let buildConfigurationTargets = ['Editor', 'Game'];
        
        buildConfigurations.forEach((buildConfiguration) => {
            buildConfigurationTargets.forEach((buildConfigurationTarget) => {
                generatedTasksGlob.push(getBuildTasks(info, buildConfiguration, buildConfigurationTarget, currentSystem));
            });
        });

        let skippedTasks = 0;
        let updatedTasks = 0;

        Promise.all(generatedTasksGlob).then((tasksArray) => {
            let tasksConfiguration = vscode.workspace.getConfiguration('tasks');
            
            if (!tasksConfiguration.get('version')) {
                tasksConfiguration.update('version', '2.0.0');
            }

            let foundTasks = tasksConfiguration.get('tasks') || [];

            tasksArray.forEach((tasks) => {
                tasks.forEach((task) => {
                    let createTask = true;
                    
                    foundTasks.forEach((foundTask) => {
                        if (foundTask.taskName && task.taskName == foundTask.taskName) {
                            createTask = false;
                        
                            if (!foundTask[currentSystem]) {
                                foundTask[currentSystem] = task[currentSystem];
                                updatedTasks++;
                            } else {
                                skippedTasks++;
                            }

                            return true; // break
                        }
                    });

                    if (createTask) {
                        foundTasks.push(task);
                        updatedTasks++;
                    }
                });

                if (updatedTasks > 0) {
                    tasksConfiguration.update('tasks', foundTasks);
                }

            });
        }).catch((err) => {
           vscode.showErrorMessage(`Generate Build Configurations Failed : ${err}`); 
        });
        
    });
}
exports.generateTaskConfigurations = generateTaskConfigurations;