import { OwnConsole } from './extension/console';
import { Command } from './extension/Entities/Command';
import { Init } from './extension/Services/CommandInit';
import { CodeActionKind, commands, Diagnostic, ExtensionContext, languages, Location, Range, TextDocument, window, WorkspaceEdit } from 'vscode';

export function activate(context: ExtensionContext) {
	OwnConsole.ownConsole = window.createOutputChannel("Noob");

	console.log('Congratulations, your extension "noob" is now active!');

	// Commands
	context.subscriptions.push(commands.registerCommand(Command.init,
		() => new Init().resolve()))
}

export function deactivate() { }