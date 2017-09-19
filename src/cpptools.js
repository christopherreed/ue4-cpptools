const fs = require('fs');
const path = require('path');
const readline = require('readline');
const vscode = require('vscode');
const util = require('./util.js')
const buildtool = require('./buildtool.js');

function generateCppToolsIncludePathFromCodeLiteProject(info) {
    var completionFilename = path.join(info.projectPath, info.projectName + 'CodeCompletionFolders.txt');

    return new Promise((resolve, reject) => {
        let includePath = [];

        fs.stat(completionFilename, (err, stats) => {
            if (err) {
                reject(`Error reading file: ${completionFilename}`);
            } else {
                let reader = readline.createInterface({
                    input: fs.createReadStream(completionFilename),
                });
                reader.on('line', (line) => {includePath.push(line);});
                reader.on('close', () => {resolve(includePath);});
            }
        });
    });
}

function generateCppToolsDefinesFromCodeLiteProject(info) {
    var definesFilename = path.join(info.projectPath, info.projectName + 'CodeLitePreProcessor.txt');

    return new Promise((resolve, reject) => {
        let defines = [];

        fs.stat(definesFilename, (err, stats) => {
            if (err) {
                reject(`Error reading file: ${definesFilename}`);
            } else {
                let reader = readline.createInterface({
                    input: fs.createReadStream(definesFilename),
                });
                reader.on('line', (line) => {defines.push(line);});
                reader.on('close', () => {resolve(defines);});
            }
        });
    });
}

function generateCppToolsBrowse(info) {
    return new Promise((resolve, reject) => {
        let browsePath = [
            '${workspaceRoot}'
        ];


        if (info.engineRootPath) {
            let engineSourcePath = path.join(info.engineRootPath, 'Engine', 'Source');
            browsePath.push(engineSourcePath);
        }

        let browse = {
            'limitSymbolsToIncludedHeaders': false,
            'path' : browsePath
        };

        resolve(browse);
    });
}

function writeCppToolsPropertiesFile(cppToolsPropertiesFile, config) {
    return new Promise((resolve, reject) => {
        let json = {};
        
        fs.readFile(cppToolsPropertiesFile, (err, data) => {
            if (err) {
                if (err.code !== 'ENOENT') {
                    reject(`Failed read '${cppToolsPropertiesFile}' : ${err.code}`);
                    return;
                }
            } else {
                json = JSON.parse(data);
            }

            let configurations = json.configurations || [];

            if (Array.isArray(configurations)) {
                let preventConfigOverwrite = true; // TODO setting
                let foundConfig = -1;

                for (i in configurations) {
                    if (configurations[i].name == config.name) {
                        foundConfig = i;
                        break;
                    }
                }
                
                if (preventConfigOverwrite && foundConfig > -1) {
                    reject(`Skipped overwrite of configuration '${config.name}'`);
                    return;
                }

                if (foundConfig < 0) {
                    configurations.push(config);
                } else {
                    configurations[foundConfig] = config;
                }

                json.configurations = configurations;
                json.version = json.version || 2;

                fs.writeFile(cppToolsPropertiesFile, JSON.stringify(json), {'flag':'w+'}, (err) => {
                    if (err) {
                        reject(`Failed to write configuration file '${cppToolsPropertiesFile}' : ${err.code}`);
                    } else {
                        resolve(`Updated configuration file '${cppToolsPropertiesFile}'`);
                    }
                });
            } else {
                reject('Invalid configuration file data');
            }
        });
    });
}

function generateCppToolsConfiguration(configName) {
    util.getProjectInfo()
    .then((info) => {
        let vscodePath = path.join(info.projectPath, '.vscode');
        let cppToolsPropertiesFile = path.join(vscodePath, 'c_cpp_properties.json');

        let configurationName = info.configurationName;

        let config = {
            'name' : configurationName,
            'includePath' : [],
            'defines' : [],
            'browse' : {}
        };

        vscode.window.withProgress({'title':'Generate CppTools Configuration', 'location':vscode.ProgressLocation.Window}, (progress) => {
            return util.touchDirectory(vscodePath)

            .then(_ => buildtool.execGenerateProjectFilesProcess(false, true, true))

            .then(_ => generateCppToolsIncludePathFromCodeLiteProject(info))
            .then((includePath) => {config.includePath = includePath;})

            .then(_ => generateCppToolsDefinesFromCodeLiteProject(info))
            .then((defines) => {config.defines = defines;})
            
            .then(_ => generateCppToolsBrowse(info))
            .then((browse) => {config.browse = browse;})

            .then(_ => writeCppToolsPropertiesFile(cppToolsPropertiesFile, config))

            .then(
                (ok) => {}, 
                (err) => {vscode.window.showErrorMessage(`Failed to generate configuration : ${err}`);}
            )}
        );
    });   
    
}
exports.generateCppToolsConfiguration = generateCppToolsConfiguration;

