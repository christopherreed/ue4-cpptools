ue4-cpptools
============
[https://github.com/christopherreed/ue4-cpptools](https://github.com/christopherreed/ue4-cpptools)

[VSCode](https://code.visualstudio.com/) extension that provides tools for working with Unreal Engine 4 C++ projects.

You may want to check out [VSCodeSourceCodeAccess](https://github.com/christopherreed/VSCodeSourceCodeAccess), an Unreal Engine 4 plugin that provides source code access for working with C++ projects using VSCode.

__USE AT YOUR OWN RISK__

This extension is completely experimental, and shouldn't be used in a production environment. Things will probably change or break regulary.

Features
--------

The goal is to supply some tools to make it a little easier to use VSCode as your IDE to edit code from Unreal Editor 4. Currently you can use it to generate a [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) IntelliSense configuration for your UE4 project. You can also build and hot reload your project (experimental). 

Most commands are run in a integrated terminal [shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration) so that the raw output is available. You can configure the [environment](https://code.visualstudio.com/updates/v1_15#_configure-environment-of-terminal-sessions) commands are run in.

This extension should work on Windows, Linux, and Mac (untested).

Install
-------

1) [Download](https://github.com/christopherreed/ue4-cpptools/releases) this extension as a .vsix package

2) Install the .vsix package. [[?]](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)

3) Set the __ue4-cpptools.engineRootPath__ and any additional settings you need to configure the extension for you workspace. [[?]](https://code.visualstudio.com/docs/getstarted/settings)

Usage
-----

Run commands with the command pallette. [[?]](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)

Commands
--------

__UE4 CppTools - Generate CppTools Configuration__ : Generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) configuration for your project.
> The configuration name can be specified with the __cppToolsConfiguration__ setting.

__UE4 CppTools - Generate Project Files__ : Generate native project files for your project. [[?]](https://docs.unrealengine.com/latest/INT/Programming/UnrealBuildSystem/ProjectFileGenerator/index.html)

__UE4 CppTools - Open Terminal__ : Open __ue4-cpptools__ terminal

__UE4 CppTools - Build Project__ : Build project.
> The build configuration can be specified with the __buildConfiguration__, __buildConfigurationTarget__, and __buildPlatform__ settings. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

__UE4 CppTools - Hot Reload Project__ : Build project for Unreal Editor HotReload
> WARNING: __Build Project__ and __Hot Reload Project__ are completely experimental at this point

__UE4 CppTools - Open Project With Unreal Editor__ : Open project with Unreal Editor

__UE4 CppTools - Run Project With Unreal Editor__ : Run an uncooked project build with Unreal Editor.
> The build configuration can be specified with __buildConfiguration__ as __Developement__ or __DebugGame__ 

Extension Settings
------------------

## Required
__ue4-cpptools.engineRootPath__ : Path to Unreal Engine 4 root directory
> You can alternately set the environment variable __UE4_ENGINE_ROOT_PATH__, but __engineRootPath__ setting will override it

## Optional

__ue4-cpptools.cppToolsConfiguration__ : Name of CppTools configuration to generate

__ue4-cpptools.recycleTerminal__ : Controls terminal reuse for the extension

## Advanced Settings (you probably shouldn't touch these)

__ue4-cpptools.buildConfiguration__ : Unreal Build Tool build configuration

__ue4-cpptools.buildConfigurationTarget__ : Unreal Build Tool build configuration target

__ue4-cpptools.buildPlatform__ : Unreal Build Tool build platform

__ue4-cpptools.overrideUnrealBuildTool__ : Override the command to run Unreal Build Tool

__ue4-cpptools.overrideUnrealEditor__ : Override the command to run Unreal Editor

Known Issues
------------

[https://github.com/christopherreed/ue4-cpptools/issues](https://github.com/christopherreed/ue4-cpptools/issues)

* Mac not tested

* Relies on the Unreal Build Tool CodeLite project generator

* Build / HotReload commands are experimental - input appreciated!

* Build broken in 4.17.0

License
-------

This software is licensed under the MIT License, see LICENSE for more information

<a href='https://ko-fi.com/A41034HG' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
