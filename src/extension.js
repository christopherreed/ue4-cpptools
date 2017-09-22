// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cpptools = require('./cpptools.js');
const buildtool = require('./buildtool.js');
const editor = require('./editor.js');
const misc = require('./misc.js');
const tasks = require('./tasks.js');
const debug = require('./debug.js');

function activate(context) {

    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.generateCppToolsConfiguration', cpptools.generateCppToolsConfiguration));
    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.generateTaskConfigurations', tasks.generateTaskConfigurations));
    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.searchOnlineDocumentation', misc.searchOnlineDocumentation));
    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.generateDebugConfigurations', debug.generateDebugConfigurations));
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;