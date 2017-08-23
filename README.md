ue4-cpptools
============
[https://github.com/christopherreed/ue4-cpptools](https://github.com/christopherreed/ue4-cpptools)

[VSCode](https://code.visualstudio.com/) extension that provides tools for working with Unreal Engine 4 C++ projects.

You may want to check out [VSCodeSourceCodeAccess](https://github.com/christopherreed/VSCodeSourceCodeAccess), an Unreal Engine 4 plugin that provides source code access for working with C++ projects using VSCode.

Warning
-------
__USE AT YOUR OWN RISK__

This extension shouldn't be used in a production environment. Things will probably change or break regulary.


Features
--------

This extension is intended to supply some tools to make it easier to use VSCode as your IDE to edit C++ code for an Unreal Engine 4 project. Currently you can use it to generate a [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) IntelliSense configuration for your UE4 project. You can also build and hot reload your project. This extension can open your project in the Unreal Editor and run uncooked builds of your project. There is also a command to search the Unreal Engine 4 online documenation.

Most commands are run in a integrated terminal [shell](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration) so that the raw output is available. You can configure the [environment](https://code.visualstudio.com/updates/v1_15#_configure-environment-of-terminal-sessions) commands are run in.

This extension should work on Windows, Linux, and Mac (untested).

Install
-------

1) [Download](https://github.com/christopherreed/ue4-cpptools/releases) this extension as a .vsix package.

2) Install the .vsix package. [[?]](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)

3) Set the *ue4-cpptools.engineRootPath* and any additional settings you need to configure the extension for you workspace. [[?]](https://code.visualstudio.com/docs/getstarted/settings)

Usage
-----

Use the command pallette to run commands. [[?]](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)

Commands
--------

__UE4 CppTools - Generate CppTools Configuration__ : Generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) configuration for your project. The configuration name can be specified with the *cppToolsConfiguration* setting.

__UE4 CppTools - Generate Project Files__ : Generate native project files for your project. [[?]](https://docs.unrealengine.com/latest/INT/Programming/UnrealBuildSystem/ProjectFileGenerator/index.html)

__UE4 CppTools - Open Terminal__ : Open the *ue4-cpptools* terminal.

__UE4 CppTools - Build Project__ : Build project. The build configuration matrix can be specified with the *buildConfiguration*, *buildConfigurationTarget*, and *buildPlatform* settings.

>__NOTE__: This command will only *build* your project; it won't do asset cooking, packaging, or anything else that might be required for your particular build configuration.

__UE4 CppTools - Hot Reload Project__ : Build project for Unreal Editor HotReload. The build configuration can be specified with *buildConfiguration* as *Developement* or *DebugGame*.

__UE4 CppTools - Open Project With Unreal Editor__ : Open project with Unreal Editor. The build configuration can be specified with *buildConfiguration* as *Developement* or *DebugGame*.

__UE4 CppTools - Run Project With Unreal Editor__ : Run an uncooked project build with Unreal Editor. The build configuration can be specified with *buildConfiguration* as *Developement* or *DebugGame*.

__UE4 CppTools - Search Unreal Engine Online Documenation__ : Search Unreal Engine 4 online documentation.

Extension Settings
------------------

__ue4-cpptools.engineRootPath__ : Path to Unreal Engine 4 root directory (*...\Epic Games\UE_4.17*).

> __NOTE__: *engineRootPath* setting is required for many commands to work.

__ue4-cpptools.cppToolsConfiguration__ : Name of CppTools configuration to generate.

__ue4-cpptools.recycleTerminal__ : Controls terminal reuse for the extension.

## Advanced Settings (you probably shouldn't touch these)

__ue4-cpptools.buildConfiguration__ : Unreal Build Tool build configuration. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

__ue4-cpptools.buildConfigurationTarget__ : Unreal Build Tool build configuration target. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

__ue4-cpptools.buildPlatform__ : Unreal Build Tool build platform. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

__ue4-cpptools.overrideUnrealBuildTool__ : Override the command to run Unreal Build Tool.

__ue4-cpptools.overrideUnrealEditor__ : Override the command to run Unreal Editor.

Known Issues
------------

[https://github.com/christopherreed/ue4-cpptools/issues](https://github.com/christopherreed/ue4-cpptools/issues)

* Mac untested - implemenations are 'best guess' at the moment

* Relies on the Unreal Build Tool CodeLite project generator

License
-------

This software is licensed under the MIT License, see LICENSE for more information

<a href='https://ko-fi.com/A41034HG' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
