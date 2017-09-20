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

This extension is intended to supply some tools to make it easier to use VSCode as your IDE to edit C++ code for an Unreal Engine 4 project. Currently you can use it to generate a [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) IntelliSense configuration for your UE4 project. You can also build your project. This extension can open your project in the Unreal Editor and run uncooked builds of your project. There is also a command to search the Unreal Engine 4 online documenation.

This extension should work on Windows, Linux, and Mac (untested).

Install
-------

1) [Download](https://github.com/christopherreed/ue4-cpptools/releases) this extension as a .vsix package.

2) Install the .vsix package. [[?]](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)

3) Set the *ue4-cpptools.engineRootPath* and any additional settings you need to configure the extension for you workspace. [[?]](https://code.visualstudio.com/docs/getstarted/settings)

Usage
-----

Use the command palette to run commands and tasks. [[?]](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)

Commands
--------

__UE4 CppTools - Generate CppTools Configuration__ : Generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) configuration for your project. The configuration name can be specified with the *configurationName* setting.

__UE4 CppTools - Generate Task Configurations__ : Generate task configurations for your project. [[?]](https://code.visualstudio.com/docs/editor/tasks) The configuration name can be specified with the *configurationName* setting.

__UE4 CppTools - Generate Debug Configurations__ : Generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) debug configurations  for your project. [[?]](https://github.com/Microsoft/vscode-cpptools/blob/master/launch.md) The configuration name can be specified with the *configurationName* setting.

__UE4 CppTools - Search Unreal Engine Online Documentation__ : Search Unreal Engine 4 online documentation.

Extension Settings
------------------

__ue4-cpptools.engineRootPath__ : Path to Unreal Engine 4 root directory (*...\Epic Games\UE_4.17*).

> __NOTE__: *engineRootPath* setting is required for many commands to work.

__ue4-cpptools.configurationName__ : Name used for generated configurations.

## Advanced Settings (you probably shouldn't touch these)

__ue4-cpptools.buildConfigurations__ : Unreal Build Tool build configurations to generate tasks for. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

__ue4-cpptools.buildConfigurationTargets__ : Unreal Build Tool build configuration targets to generate tasks for. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

__ue4-cpptools.buildPlatform__ : Unreal Build Tool build platform to generate tasks for. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

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
