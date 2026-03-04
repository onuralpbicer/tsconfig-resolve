import * as vscode from "vscode";
import { TSConfigViewProvider } from "./viewProvider";

export function activate(context: vscode.ExtensionContext) {
    const provider = new TSConfigViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            provider.updateDocument(editor?.document);
        }),
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            TSConfigViewProvider.viewType,
            provider,
        ),
    );
}

export function deactivate() {}
