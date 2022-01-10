# Noob

[![Open in Visual Studio Code](images/open-in-vscode.png)](https://open.vscode.dev/DavidRoys/noob)

You can support me here:

[![https://www.buymeacoffee.com/davidroys](./images/buymeacoffeeSmall.png)](https://www.buymeacoffee.com/davidroys)

## Overview

Quickly get started on new projects by copying the files you need from a template folder. Quick pick menus and variable substitutions allow the user to select how the initial project should be configured.

## Features

|Feature  |Description  |
|---------|---------|
|**Initialise**     | Noob only has one feature: to copy files from the path you specify in the settings to the current workspace. To configure noob, open vs code settings and fill in the path to a folder that contains your starter project. If you want to do anything fancy, like select from a list of project types, or substitute placeholders within certain files, see the [.noob\settings.json](#noobsettingsjson) section to learn how. If you want to know why I created this extension, take a look at [Why?](#why)|

## Known Issues

- See github issues

## Thanks to

- David Feldhoff for your time, expertise, and generosity. I would not (and could not) have started this project without your help.

## .noob\settings.json

If the folder you are copying files from contains a .noob folder and if that folder contains a settings.json, you'll be able to access some more advanced features of noob such as presenting the user with a menu of options to select from and specifying files in the folder that should have variables substituted. To have nested menus, simply create subfolders that also contain a .noob\settings.json file.

### Folder Choice

To provide a menu of options, simply create a folderPickItems element in your .noob\settings.json file as an array of objects that are very similar to the structure of a QuickPickItem. In addition to the array of options, you can provide a folderPickPlaceHolder element to indicate the prompt for the quick pick menu when it is displayed to the user. The possible options are described below:

| Name | Description |
|------|-------------|
| label | Text that is displayed in bold at the start of the quick pick item. |
| description | A longer text description of the item that is displayed to the right of the label. |
| folder | The path to the folder that will be used as the source of files to copy into the current project when this item is selected by the user. As a useful convention, consider naming your folder with underscores, the thing the user is selecting, and the option they will select. See the example below. |
| picked | An optional true or false field that indicates if this item is the default value. |

```
{
    "folderPickPlaceHolder" : "Target platform",
    "folderPickItems": [
        {
            "label": "8.0",
            "description": "Business Central 2021 release wave 2",
            "folder": "_platform_8.0",
            "picked" : true
        },
        {
            "label": "7.0",
            "description": "Business Central 2021 release wave 1",
            "folder": "_platform_7.0"
        },
        {
            "label": "6.0",
            "description": "Business Central 2020 release wave 2",
            "folder": "_platform_6.0"
        },
        {
            "label": "5.0",
            "description": "Business Central 2020 release wave 1",
            "folder": "_platform_5.0"
        }
    ],
    "toSubstitute": [
        "app.json"
    ]
}
```

Note that any folders that appear in the list of folder choices will be excluded from the copy if they are not the chosen folder.

### Variable Substitution

To substitue variables within a file, simply include the path to the file name in the toSubstitute array.

```
{
    "toSubstitute": [
        "app.json"
    ]
}
```
The following variables are supported:

| Variable Name | Substituted With |
|-|-|
| {{NewGUID}} | A new GUID will be generated at the start of running the noob.init command and substituted for any occurence of this variable. |
| {{CurrentFolder}} | The name of the current project folder. In my projects I use the current folder name as the app name and I will use this value as the app name in my app.json. |
| {{ParentFolder}} | The name of the parent folder. In my projects I use the parent folder as the customer name. I can join the customer name to my own company name to form the publisher name for my AL projects. |

### Common Files

If you have files that are common to all project types, simply place them in the configured noob folder. This allows your subfolders to only contain the differences.

## Why?

This extension was created to solve a specific problem (aren't they all?). When starting a new project for the AL programming language, I would typically create a new project in Azure DevOps with a name that matched the name of my app. I would initialise the project with a .gitignore and README.md file that I intended to overwrite later (because the AL programming language is not an option to select when creating the gitignore). I would then ensure my local c:\dev\repos folder contained a folder that matched my customer name (for my per-tenant-extension), and clone the remote repository to the local folder. Finally I would overwrite the .gitignore and README.md with files from my template folder (along with many other files such as a logo, an app.json, a ruleset.json and all of the other files I need for my project). Oh, actually finally, I would then open my app.json file and put in a new GUID for the app id, and then set the app name to be the same as my current folder and reference the customer name in the publisher.

When I said I would copy files from my template folder, I would set up my template folder by using the AL.GO! command in the AL Language extension to create an empty project for the version of AL and fill in my additional files. The template would need to be updated every time the file formats change in AL or new files are added in.

This extension allows me to do all of the above with a single command in VS Code. It also allows me to centrally control the template folder within its own Azure DevOps repo so I can ensure settings can be rolled out to all developers easily with a simple refresh.

When I created this extension, I figured the tool was fairly generic and may be useful to other developers for AL that configure their projects in a different way, or even for developers to get started on a project using a language I've never heard of. If you can make use of this tool, please enjoy using it.

## About me

I am me.