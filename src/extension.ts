"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { access, append, unlink, copy } from './fs';
import * as path from 'path';

const monkeypatch =`
  .monaco-editor.mac .view-line { -webkit-font-smoothing: none }
  .mtki { font-style: normal !important }
  .mtkb { font-weight: normal !important }
`;

const main = path.join(process.argv[1],
              "../vs/workbench/electron-browser/workbench.main.css");
const backup = main + ".backup";

async function isAlreadyPatched() {
  try {
    await access(backup);
    return true;
  } catch (e) {
    return false;
  }
}

export async function activate(context: vscode.ExtensionContext) {
  let cssFile;

  if (await isAlreadyPatched()) {
    console.info("The file is already patched.");
    return;
  }

  try {
    console.info("Create a backup copy.");
    copy({from: main, to: backup});

    await append(main, monkeypatch);
    console.info("Patch applied. It may need a window's reload.");
  } catch (e) {
    console.error(`Can't patch "${main}".`);
  }

}

// this method is called when your extension is deactivated
export async function deactivate() {
  try {
    if (await isAlreadyPatched()) {
      console.info("Restore the original copy.");
      await copy({from: backup, to: main});
      unlink(backup);
    }
  } catch (e) {
    console.error(`Can't restore "${backup}".`);
  }
}
