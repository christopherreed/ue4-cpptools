ue4-cpptools
============

[VSCode](https://code.visualstudio.com/) extension that provides tools for working with Unreal Engine 4 C++ projects.

You may want to check out [VSCodeSourceCodeAccess](https://github.com/christopherreed/VSCodeSourceCodeAccess), an Unreal Engine 4 plugin that provides source code access for working with C++ projects using VSCode.

<a href='https://ko-fi.com/A41034HG' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

Install
-------

1) [Download](https://github.com/christopherreed/ue4-cpptools/releases) this extension as a .vsix package

2) Install the .vsix package. [[?]](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)

Usage
-----

1) Use the [extension settings](#Settings) to configure the extension for you workspace. [[?]](https://code.visualstudio.com/docs/getstarted/settings)

2) Run [commands](#Commands) with the command pallette. [[?]](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)


Commands
--------

* __UE4 CppTools - Generate CppTools Configuration__ : Generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) configuration for working with Unreal Engine 4 projects

* __UE4 CppTools - Generate Project Files__ : Generate project files for building Unreal Engine 4 projects

* __UE4 CppTools - Build Project__ : Build project

* __UE4 CppTools - Hot Reload Project__ : Build project for editor HotReload

Extension Settings
------------------
### Required
* __ue4-cpptools.engineRootPath__ : Path to Unreal Engine 4 root directory (overrides environment variable __UE4_ENGINE_ROOT_PATH__)

### Optional
* __ue4-cpptools.configurationName__ : Name of CppTools configuration to generate

* __ue4-cpptools.recycleTerminal__ : Controls terminal reuse for the extension

### Advanced Settings (you probably shouldn't touch these)

* __ue4-cpptools.buildConfiguration__ : Unreal Build Tool build configuration

* __ue4-cpptools.overrideUnrealBuildTool__ : Override the command to run Unreal Build Tool

Known Issues
------------

* Mac not tested

* Relies on the Unreal Build Tool CodeLite project generator

License
-------

This software is licensed under the MIT License, see LICENSE for more information