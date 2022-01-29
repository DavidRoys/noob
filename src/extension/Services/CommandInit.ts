import { config, exit } from "process";
import { window } from "vscode";
import { IInit as IInit } from "../Interfaces/IInit";
import { Config } from "../Utils/config";
import { OwnConsole } from "../console";
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Err } from "../Utils/Err";
import { v4 as uuidv4 } from 'uuid';
import { stringify } from "querystring";

interface FolderQuickPickItem { label: string, description?: string, detail?: string, picked?: boolean, alwaysShow?: boolean; folder: string }

export class Init {
    async resolve() {
        let FilesToCopyMap: Map<string, string> = new Map<string, string>();
        let FilesToSubstitute: string[] = [];
        let NewProjectFilesLocation: string = Config.getNewProjectFilesLocation();
        let targetFolder: string[];
        let foldersToExclude: string[] = [];
        const NewGuidPlaceholder: string = '{{NewGUID}}';
        const CurrentFolderPlaceholder: string = '{{CurrentFolder}}';
        const ParentFolderPlaceholder: string = '{{ParentFolder}}';
        let NewGuidValue = uuidv4();
        let ParentFolderValue = '';
        let CurrentFolderValue = '';

        //| {{NewGUID}} | A new GUID will be generated at the start of running the noob.init command and substituted for any occurence of this variable. |
        //| {{CurrentFolder}} | The name of the current project folder. In my projects I use the current folder name as the app name and I will use this value as the app name in my app.json. |
        //| {{ParentFolder}} | The name of the parent folder. In my projects I use the parent folder as the customer name. I can join the customer name to my own company name to form the publisher name for my AL projects. |

        if (NewProjectFilesLocation == '') {
            let errorMessage = 'You must specify a path to the folder that contains new files and settings in the Noob configuration settings.';
            OwnConsole.ownConsole.appendLine('Error: ' + errorMessage);
            vscode.window.showErrorMessage(errorMessage);
            return;
        }

        // Check that the file path specified in the settings exists. Show an error message and exit if it doesn't.    
        if (!fs.existsSync(NewProjectFilesLocation)) {
            vscode.window.showErrorMessage(`Folder ${NewProjectFilesLocation} does not exist.`);
            return;
        }

        // Find the target workspace folder
        let allWorkspaceFolders = vscode.workspace.workspaceFolders;
        let workSpaceFolderCount = allWorkspaceFolders?.length;

        if (allWorkspaceFolders = undefined) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        } else {
            if (workSpaceFolderCount && workSpaceFolderCount > 1) {
                vscode.window.showErrorMessage('Multi workspace not supported.');
                return;
            }
        }

        targetFolder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath)!;
        let CurrentFolder = vscode.workspace.workspaceFolders?.map(folder => folder.name)!;
        CurrentFolderValue = CurrentFolder[0];
        var path = require('path');
        let CurrentFolderSplit = targetFolder[0].split(path.sep);
        ParentFolderValue = CurrentFolderSplit[CurrentFolderSplit.length - 2];

        foldersToExclude.push(path.join(NewProjectFilesLocation, '.git'));
        
        await this.findFilesToProcess(NewProjectFilesLocation, FilesToCopyMap, foldersToExclude, FilesToSubstitute, targetFolder[0]);

        // Log the files that will be copied and substituted to the console to allow the user to make an informed decision.
        OwnConsole.ownConsole.appendLine('Preparing to copy files...');
        for (let key of FilesToCopyMap.keys()) {
            let value = FilesToCopyMap.get(key);
            OwnConsole.ownConsole.appendLine(`  from "${value}" --> "${key}"`);
        }

        // Remove duplicates from files to substitute.
        FilesToSubstitute = FilesToSubstitute.filter((item, pos) => {
            return FilesToSubstitute.indexOf(item) == pos;
        });

        // Log the files that will be substituted.
        if (FilesToSubstitute.length > 0) {
            OwnConsole.ownConsole.appendLine('Potentially substituting values in files...');
            FilesToSubstitute.forEach(element => {
                OwnConsole.ownConsole.appendLine(`  "${element}"`);
            });
        } else {
            OwnConsole.ownConsole.appendLine('No files for substitution of values requested.');
        }

        // If we're going to overwrite files - get the user to confirm before continuing.
        let FilesToOverwrite: string[] = [];
        FilesToCopyMap.forEach((value, key) => {
            if (fs.existsSync(key)) {
                const fileStatus = fs.statSync(key);
                if (fileStatus.isFile())
                    FilesToOverwrite.push(key);
            }
        });

        OwnConsole.ownConsole.appendLine(`Potentially overwriting ${FilesToOverwrite.length} files...`);
        FilesToOverwrite.forEach(element => {
            OwnConsole.ownConsole.appendLine(`  "${element}"`);
        });

        OwnConsole.ownConsole.show();

        if (FilesToOverwrite.length > 0) {
            OwnConsole.ownConsole.appendLine(`\n${FilesToOverwrite.length} files will be overwritten. Are you sure you want to continue? (Waiting for input...)`);
            OwnConsole.ownConsole.show();
            var answer = await vscode.window.showInformationMessage(
                `${FilesToOverwrite.length} files will be overwritten. Are you sure you want to continue?`,
                ...["Yes", "No"]
            );
            if (answer === "Yes") {
                OwnConsole.ownConsole.appendLine('Yes selected. Here we go...\n');
                OwnConsole.ownConsole.show();
            } else {
                OwnConsole.ownConsole.appendLine('No selected. Initialise aborted.\n');
                vscode.window.showErrorMessage('Initialise aborted.');
                OwnConsole.ownConsole.show();
                return;
            }
        }

        // Copy all files from the files to copy map.
        OwnConsole.ownConsole.appendLine('Initialising files and directories...');
        FilesToCopyMap.forEach((value, key) => {
            let fileStatus = fs.statSync(value);
            if (fileStatus.isFile()) {
                fs.copyFileSync(value, key);
                OwnConsole.ownConsole.appendLine(`  File "${key}" copied from template.`);
            } else {
                if (!fs.existsSync(key)) {
                    fs.mkdirSync(key);
                    OwnConsole.ownConsole.appendLine(`  Directory "${key}" created.`);
                }
                else
                    OwnConsole.ownConsole.appendLine(`  Directory "${key}" already exists.`);
            }
        });

        // Substitute values in files.
        if (FilesToSubstitute.length > 0) {
            OwnConsole.ownConsole.appendLine('Substituting values in files...');
            OwnConsole.ownConsole.appendLine(`  ${NewGuidPlaceholder} = ${NewGuidValue}`);
            OwnConsole.ownConsole.appendLine(`  ${CurrentFolderPlaceholder} = ${CurrentFolderValue}`);
            OwnConsole.ownConsole.appendLine(`  ${ParentFolderPlaceholder} = ${ParentFolderValue}`);
            FilesToSubstitute.forEach((filePath: string) => {
                if (fs.existsSync(filePath)) {
                    let fileToSubstituteContent = fs.readFileSync(filePath).toString();
                    fileToSubstituteContent = fileToSubstituteContent.replace(NewGuidPlaceholder, NewGuidValue);
                    fileToSubstituteContent = fileToSubstituteContent.replace(CurrentFolderPlaceholder, CurrentFolderValue);
                    fileToSubstituteContent = fileToSubstituteContent.replace(ParentFolderPlaceholder, ParentFolderValue);
                    fs.writeFileSync(filePath, fileToSubstituteContent);
                    OwnConsole.ownConsole.appendLine(`  ${filePath} updated.`);
                } else {
                    OwnConsole.ownConsole.appendLine(`  ${filePath} not found. Substitution ignored.`);
                }
            });
        }

        vscode.window.showInformationMessage('Project initialised OK.');
        OwnConsole.ownConsole.appendLine(`\nProject initialised OK.`);

    }

    private async findFilesToProcess(currentPath: string, filesToFromMap: Map<string, string>, foldersToExclude: string[], filesToSubstitute: string[], targetFolder: string) {
        var path = require('path');
        const settingsFolderName: string = path.join(currentPath, '.noob');
        const settingsFileName: string = path.join(settingsFolderName, 'settings.json');
        if (fs.existsSync(settingsFileName)) {
            let noobSettingsRaw = fs.readFileSync(settingsFileName);
            let noobSettings = JSON.parse(noobSettingsRaw.toString());
            let quickPickItems: FolderQuickPickItem[] = noobSettings.folderPickItems;
            noobSettings.toSubstitute.forEach((fileName: string) => {
                filesToSubstitute.push(path.join(targetFolder, fileName));
            });

            var result = await window.showQuickPick(quickPickItems,
                {
                    placeHolder: `${noobSettings.folderPickPlaceHolder}`,
                });

            if (result != undefined) {
                await this.findFilesToProcess(path.join(currentPath, result.folder), filesToFromMap, foldersToExclude, filesToSubstitute, targetFolder);

                quickPickItems.forEach((element, index) => {
                    foldersToExclude.push(path.join(currentPath, element.folder));
                });
            }
        }

        this.mapFilesInDirectory(currentPath, filesToFromMap, targetFolder, foldersToExclude);

    }

    private mapFilesInDirectory(directoryPath: string, FilesToCopyMap: Map<string, string>, targetFolder: string, foldersToExclude: string[]) {
        const files = fs.readdirSync(directoryPath);

        var path = require('path');

        for (const file of files) {
            const fromPath = path.join(directoryPath, file);
            const stat = fs.statSync(fromPath);
            if (!stat.isDirectory()) {
                FilesToCopyMap.set(path.join(targetFolder, file), fromPath);
            } else {
                if (file != '.noob' && !foldersToExclude.includes(fromPath)) {
                    FilesToCopyMap.set(path.join(targetFolder, file), fromPath);
                    this.mapFilesInDirectory(fromPath, FilesToCopyMap, path.join(targetFolder, file), foldersToExclude);
                }
            }
        }
    }
}