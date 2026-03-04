import * as vscode from "vscode";
import * as path from "node:path";

export class TSConfigViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "tsconfig-resolve";

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    updateDocument(document?: vscode.TextDocument) {
        if (!this._view) {
            return;
        }

        if (!document) {
            this._view.title = "";
            return;
        }

        this._view.title = path.basename(document.fileName);
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        const webviewScriptUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "dist", "webview.js"),
        );
        const webviewStyleUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(
                this._extensionUri,
                "dist",
                "vscode-webview.css",
            ),
        );

        this.updateDocument(vscode.window.activeTextEditor?.document);

        webviewView.webview.onDidReceiveMessage((data) => {
            console.log(data);
        });

        this._view.webview.html = `
    <!DOCTYPE html>
    <html>
    <head>
            <link rel="stylesheet" href="${webviewStyleUri}">
    </head>
    <body>
        <div id="app"></div>
    <script src="${webviewScriptUri}"></script>

    </body>
    </html>
`;
    }
}
