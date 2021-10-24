import { ConfigurationScope, Uri, workspace } from "vscode";

export class Config {
    private static getConfig(uri?: Uri) {
        return workspace.getConfiguration('noob', uri);
    }
    static getNewProjectFilesLocation(uri?: Uri): string {
        return this.getConfig(uri).get('newProjectFilesLocation', '');
    }
    static setNewProjectFilesLocation(uri: Uri | undefined, newValue: boolean | undefined) {
        this.getConfig(uri).update('newProjectFilesLocation', newValue);
    } 
}