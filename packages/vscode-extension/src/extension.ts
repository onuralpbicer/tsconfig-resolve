import * as vscode from "vscode";
import { TSConfigViewProvider } from "./viewProvider";
import { findNearestTsConfig } from "@tsconfig-resolve/core";

export function activate(context: vscode.ExtensionContext) {
    const provider = new TSConfigViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            const activeEditor = editor?.document.uri;
            console.log("editor", activeEditor);
            if (!activeEditor) {
                // todo: show could not find
                return;
            }

            const workspaceRoot =
                vscode.workspace.getWorkspaceFolder(activeEditor);

            if (!activeEditor || !workspaceRoot) {
                // todo: show could not find
                return;
            }

            const tsConfig = await findNearestTsConfig(
                editor.document.fileName,
                workspaceRoot.uri.fsPath,
            );

            // if (tsConfig) {
            //     console.log("found tsconfig", tsConfig);
            // } else {
            //     console.log("could not find tsconfig");
            // }
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
