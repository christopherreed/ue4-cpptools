const vscode = require('vscode');
const child_process = require('child_process');

var terminals = {};

function removeTerminal(terminal) {
    let terminalName = terminal.name;

    if (terminalName && terminals[terminalName] === terminal) {
        terminals[terminalName] = undefined;
    }
}
exports.removeTerminal = removeTerminal;

function findTerminal(terminalName) {
    let recycleTerminal = vscode.workspace.getConfiguration('ue4-cpptools').get('recycleTerminal') || 'Always';

    if (recycleTerminal == 'Always' || !terminalName) {
        terminalName = 'ue4-cpptools';
    }

    let term = terminals[terminalName];
    if (recycleTerminal == 'Never' || !term) {
        term = vscode.window.createTerminal(terminalName);
        if (recycleTerminal != 'Never') terminals[terminalName] = term;
    }

    return term;
}
exports.findTerminal = findTerminal;

// Enclose string in quotes if it contains a space char
function fixStringWithSpaces(str) {
    if (str.includes(' ')) return `"${str}"`;
    return str;
}

function buildArgsString(args) {
    let commandStr = '';
    args.forEach((val) => {
        let str = val.toString();
        
        commandStr = commandStr.concat(fixStringWithSpaces(str) + ' ');
    });
    
    return commandStr;
}

function runCommandInTerminal(command, args, terminalName) {
    let terminal = findTerminal(terminalName);

    let commandStr = fixStringWithSpaces(command) + ' ' + buildArgsString(args);

    let shell = vscode.workspace.getConfiguration().terminal.integrated.shell.windows;
    if (shell && shell.endsWith('powershell.exe')) {
        // powershell requires us to prepend the call operator '&' to run commands not in cwd or on path
        commandStr = '& ' + commandStr;
    }
    
    terminal.show();
    terminal.sendText(commandStr);
}
exports.runCommandInTerminal = runCommandInTerminal;

function execCommandInProcess(command, args) {
    return new Promise((resolve, reject) => {
        let commandStr = fixStringWithSpaces(command) + ' ' + buildArgsString(args);
        
        child_process.exec(commandStr, (err) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(0);
            }
        });
    });
} 
exports.execCommandInProcess = execCommandInProcess;