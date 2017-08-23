const vscode = require('vscode');

function searchOnlineDocumentation() {
    let query = 'https://docs.unrealengine.com/latest/INT/Programming/Introduction/';
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
        if (query) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.unrealengine.com/bing-search?keyword=${query}`));
        }
    });
}
exports.searchOnlineDocumentation = searchOnlineDocumentation;