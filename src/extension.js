// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cpptools = require('./cpptools.js');
const buildtool = require('./buildtool.js');
const terminal = require('./terminal.js');

function activate(context) {

    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.generateCppToolsConfiguration', cpptools.generateCppToolsConfiguration));
    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.generateProjectFiles', buildtool.generateProjectFiles));
    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.buildProject', buildtool.buildProject));
    context.subscriptions.push(vscode.commands.registerCommand('ue4-cpptools.hotReloadProject', buildtool.hotReloadProject));

    context.subscriptions.push(vscode.window.onDidCloseTerminal(term => {terminal.removeTerminal(term);}));
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;