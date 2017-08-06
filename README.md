ue4-cpptools
============
[https://github.com/christopherreed/ue4-cpptools](https://github.com/christopherreed/ue4-cpptools)

[VSCode](https://code.visualstudio.com/) extension that provides tools for working with Unreal Engine 4 C++ projects.

You may want to check out [VSCodeSourceCodeAccess](https://github.com/christopherreed/VSCodeSourceCodeAccess), an Unreal Engine 4 plugin that provides source code access for working with C++ projects using VSCode.

Features
--------
__USE AT YOUR OWN RISK__

This extension is completely experimental, and shouldn't be used in a production environment. Things will probably change or break regulary.

The goal is to supply some tools to make it a little easier to use VSCode as your IDE to edit code from Unreal Editor 4.

Currently you can use it to generate a [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) IntelliSense configuration for your UE4 project. You can also build your project (experimental). Most commands are run in a integrated terminal (bash, cmd.exe, powershell, etc.) so the raw output is available.

This extension should work on Windows, Linux, and Mac (untested).

Install
-------

1) [Download](https://github.com/christopherreed/ue4-cpptools/releases) this extension as a .vsix package

2) Install the .vsix package. [[?]](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)

Usage
-----

1) Set the [required](#Required) settings and any additional settings you need to configure the extension for you workspace. [[?]](https://code.visualstudio.com/docs/getstarted/settings)

2) Run [commands](#Commands) with the command pallette. [[?]](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)


Commands
--------

__UE4 CppTools - Generate Project Files__ : Generate CodeLite (used by __Generate CppTools Configuration__) and native project files for your project.

__UE4 CppTools - Generate CppTools Configuration__ : Generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) configuration for your project. The configuration name can be specified with the __configurationName__ setting.

>NOTE: Run __Generate Project Files__ command to generate the CodeLite project files required by __Generate CppTools Configuration__

__UE4 CppTools - Build Project__ : Build project. The build configuration can be specified with the __buildConfiguration__ setting.

__UE4 CppTools - Hot Reload Project__ : Build project for editor HotReload
> WARNING: __Build Project__ and __Hot Reload Project__ are completely experimental at this point

Extension Settings
------------------
### Required
__ue4-cpptools.engineRootPath__ : Path to Unreal Engine 4 root directory
> You can alternately set the environment variable __UE4_ENGINE_ROOT_PATH__, but __engineRootPath__ setting will override it

### Optional
__ue4-cpptools.configurationName__ : Name of CppTools configuration to generate

__ue4-cpptools.recycleTerminal__ : Controls terminal reuse for the extension

### Advanced Settings (you probably shouldn't touch these)

__ue4-cpptools.buildConfiguration__ : Unreal Build Tool build configuration

__ue4-cpptools.overrideUnrealBuildTool__ : Override the command to run Unreal Build Tool

Known Issues
------------
[https://github.com/christopherreed/ue4-cpptools/issues](https://github.com/christopherreed/ue4-cpptools/issues)

* Mac not tested

* Relies on the Unreal Build Tool CodeLite project generator

* Build / HotReload commands are experimental - input appreciated!

License
-------

This software is licensed under the MIT License, see LICENSE for more information

<a href='https://ko-fi.com/A41034HG' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
