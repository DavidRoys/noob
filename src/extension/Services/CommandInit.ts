import { config, exit } from "process";
import { window } from "vscode";
import { IInit as IInit } from "../Init/IInit";
import { Config } from "../Utils/config";
import { OwnConsole } from "../console";
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Err } from "../Utils/Err";

export class Init {
    async resolve() {
        let NewProjectFilesLocation: string = Config.getNewProjectFilesLocation();

        if (NewProjectFilesLocation == '') {
            let errorMessage = 'You must specify a path to the folder that contains new files and settings in the Noob configuration settings.';
            OwnConsole.ownConsole.appendLine('Error: ' + errorMessage);
            vscode.window.showErrorMessage(errorMessage);
            return;
        } else {
            let informationMessage = 'Copying files from ' + NewProjectFilesLocation;
            vscode.window.showInformationMessage(informationMessage);
        }

        // Check that the file path specified in the settings exists. Don't continue.    
        if (!fs.existsSync(NewProjectFilesLocation)) {
            vscode.window.showErrorMessage('Folder ' + NewProjectFilesLocation + ' does not exist.');
            return;
        }
        
        var path = require('path');
        var settingsFileName: string = path.join(NewProjectFilesLocation, '.noob/settings.json');
        if (fs.existsSync(settingsFileName)) {
            vscode.window.showInformationMessage('Settings file found at '+settingsFileName);
        } else {
            vscode.window.showInformationMessage('No settings file found at '+settingsFileName);
        }

        // if find a .noob\settings.json

            // read the list of folders that could be used and if there is more than one show a quick pick to get the source folder
            // read a list of files that should be parsed and have values substituted.
            // read the path to common files

        // else

            // set source folder to the settings noob path folder.

        // If we have a common files path copy these files.
        // Copy all files from the source folder to the current folder.
        // If the file is in the substitues list process substitutions.

        // possibly need to do a "reload window" type to get this project recognised as an al project.


/*

chooseTargetPlatform(dir) {
        const options = ({
            canPickMany: false,
            ignoreFocusOut: true,
            placeHolder: resources_1.default.targetPlatformPlaceholder
        });
        const createItem = (label, description, picked = false) => {
            return {
                "label": label,
                "description": description,
                "picked": picked
            };
        };
        return new Promise((resolve) => {
            vscode.window.showQuickPick([
                createItem("8.0", "Business Central 2021 release wave 2", true),
                createItem("7.0", "Business Central 2021 release wave 1"),
                createItem("6.0", "Business Central 2020 release wave 2"),
                createItem("5.0", "Business Central 2020 release wave 1"),
                createItem("4.0", "Business Central 2019 release wave 2"),
                createItem("3.0", "Business Central Spring '19 Release"),
                createItem("2.0", "Business Central Fall '18 Release"),
                createItem("1.0", "Business Central Spring '18 Release")
            ], options).then(target => {
                resolve([dir, target.label]);
            });
        });
    }

        let cops: Map<Cops, string> = new Map();
        cops.set(Cops.AA0206, 'AA0206 - The value assigned to a variable must be used, otherwise the variable is not necessary.')
        cops.set(Cops.AA0137, 'AA0137 - Do not declare variables that are unused.')
        cops.set(Cops.AA0008, 'AA0008 - Function calls should have parenthesis even if they do not have any parameters.')

        let whichCop: string | undefined = await window.showQuickPick(Array.from(cops.values()), { placeHolder: 'Which warning do you want to fix?' })
        let impl: IInit;
        switch (whichCop) {
            case cops.get(Cops.AA0206):
                impl = new CommandFixAssignedButUnusedVariableAA0206()
                break;
            case cops.get(Cops.AA0137):
                impl = new CommandFixUnusedVariablesAA0137()
                break;
            case cops.get(Cops.AA0008):
                impl = new CommandFixMissingParenthesesAA0008();
                break;
            default:
                return;
        }

        impl.resolve();
*/
    }
}