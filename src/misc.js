const vscode = require('vscode');
const util = require('./util.js');

function searchOnlineDocumentation() {
    let query = undefined;
    if (vscode.window.activeTextEditor) {
        let selection = vscode.window.activeTextEditor.selection;
        if (selection && !selection.isEmpty) {
            let selectionText = vscode.window.activeTextEditor.document.getText(selection);
            if (!selectionText.includes(' ')) {
                query = selectionText;
            }
        } 
    }

    vscode.window.showInputBox({'prompt':'Search Unreal Engine Online Documentation', 'value':query}).then((query) => {
        if (query !== undefined) {
            if (query.length > 0) {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.unrealengine.com/bing-search?keyword=${query}`));
            } else {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://docs.unrealengine.com/latest/INT/'));
            }
            util.showIndicator(`Search Unreal Engine Online Documentation : ${query ? query : 'Documentation'}`);
        }
    });
}
exports.searchOnlineDocumentation = searchOnlineDocumentation;