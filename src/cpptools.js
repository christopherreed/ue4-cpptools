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

function findSubDirsSync(rootPath, dir, results) {
    let files = [];
    try {
        files = fs.readdirSync(rootPath);
    } catch (err) {
        if (err.code != 'ENOENT') {
            throw(err);
        }
    }

    files.forEach((file) => {
        let fullPath = path.join(rootPath, file);

        let stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (dir == '*') {
                results.push(fullPath);
            } else if (dir == file) {
                findSubDirsSync(fullPath, '*', results);
            } else {
                findSubDirsSync(fullPath, dir, results);
            }
        }
    });
}

function generateIntermediateIncludePaths(info) {
    let intermediatePath = path.join(info.projectPath, 'Intermediate', 'Build', info.buildPlatform);
    
    return new Promise((resolve, reject) => {
        let foundIncPaths = [];
        try {
            findSubDirsSync(intermediatePath, 'Inc', foundIncPaths);
            resolve(foundIncPaths);
        } catch (err) {
            reject(err);
        }
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
                let cppToolsDefaultConfigNames = {
                    'linux' : 'Linux',
                    'win32' : 'Win32',
                    'darwin' : 'Mac'
                };
                let defaultConfigName = cppToolsDefaultConfigNames[process.platform];

                let foundConfig;
                let foundDefaultConfig;

                configurations.forEach((cfg) => {
                    if (cfg.name && cfg.name == config.name) {
                        foundConfig = cfg;
                    }

                    if (cfg.name && cfg.name == defaultConfigName) {
                        foundDefaultConfig = cfg;
                    }
                });
                
                if (foundConfig) {
                    vscode.window.showInformationMessage(`Skipped overwrite of configuration '${config.name}'`);
                    resolve();
                } else {
                    // Append system default config values if present; also from clang -v 
                    if (foundDefaultConfig) {        
                        if (foundDefaultConfig.includePath) {
                            foundDefaultConfig.includePath.forEach((val) => {
                                if (config.includePath.indexOf(val) < 0) {
                                    config.includePath.push(val);
                                }
                            });
                        }

                        if (foundDefaultConfig.defines) {
                            foundDefaultConfig.defines.forEach((val) => {
                                if (config.defines.indexOf(val) < 0) {
                                    config.defines.push(val);
                                }
                            });
                        }
                        
                       
                        if (foundDefaultConfig.browse && foundDefaultConfig.browse.path) {
                           foundDefaultConfig.browse.path.forEach((val) => {
                               if (config.browse.path.indexOf(val) < 0) {
                                   config.browse.path.push(val);
                               }
                           });
                        }
                    }

                    configurations.push(config);
                
                    json.configurations = configurations;
                    json.version = json.version || 3;

                    fs.writeFile(cppToolsPropertiesFile, JSON.stringify(json, null, '\t'), {'flag':'w+'}, (err) => {
                        if (err) {
                            reject(`Failed to write configuration file '${cppToolsPropertiesFile}' : ${err.code}`);
                        } else {
                            resolve();
                        }
                    });
                }
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
            'includePath' : ['${workspaceRoot}'],
            'defines' : [],
            'browse' : {}
        };

        vscode.window.withProgress({'title':'Generate CppTools Configuration', 'location':vscode.ProgressLocation.Window}, (progress) => {
            return util.touchDirectory(vscodePath)

            .then(_ => buildtool.execGenerateProjectFilesProcess(false, true, true))

            .then(_ => generateCppToolsIncludePathFromCodeLiteProject(info))
            .then((includePath) => {
                config.includePath = config.includePath.concat(includePath);
            })

            .then(_ => generateIntermediateIncludePaths(info))
            .then((intermediateIncludePaths) => {
                config.includePath = config.includePath.concat(intermediateIncludePaths);
            })

            .then(_ => generateCppToolsDefinesFromCodeLiteProject(info))
            .then((defines) => {
                config.defines = defines;
            })
            
            .then(_ => generateCppToolsBrowse(info))
            .then((browse) => {
                config.browse = browse;
            })

            .then(_ => writeCppToolsPropertiesFile(cppToolsPropertiesFile, config))

            .catch((err) => {
                vscode.window.showErrorMessage(`Failed to generate configuration : ${err}`);
            })
        });
    });   
    
}
exports.generateCppToolsConfiguration = generateCppToolsConfiguration;

