const vscode = require('vscode');
const child_process = require('child_process');

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

function execCommandInProcess(command, args) {
    return new Promise((resolve, reject) => {
        let commandStr = fixStringWithSpaces(command) + ' ' + buildArgsString(args);
        
        child_process.exec(commandStr, (err) => {
            if (err) {
                if (err.code) {
                    reject(err.code);
                } else {
                    resolve(undefined); // ignore errors, without an error code - probably a killed process
                }
            } else {
                resolve(0);
            }
        });
    });
} 
exports.execCommandInProcess = execCommandInProcess;