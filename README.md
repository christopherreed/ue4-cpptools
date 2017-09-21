ue4-cpptools
============
[https://github.com/christopherreed/ue4-cpptools](https://github.com/christopherreed/ue4-cpptools)

[VSCode](https://code.visualstudio.com/) extension that provides tools for working with Unreal Engine 4 C++ projects.

You may want to check out [VSCodeSourceCodeAccess](https://github.com/christopherreed/VSCodeSourceCodeAccess), an Unreal Engine 4 plugin that provides source code access for working with C++ projects using VSCode.

Warning
-------
__USE AT YOUR OWN RISK__

This is an **unofficial** extension and it is not affiliated in any way with Epic Games. This extension shouldn't be used in a production environment. Things will probably change and/or break regulary.

Install
-------

1) [Download](https://github.com/christopherreed/ue4-cpptools/releases) this extension as a .vsix package.

2) Install the .vsix package. [[?]](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)

3) Set the *ue4-cpptools.engineRootPath* and any additional settings you need to configure the extension for you workspace. [[?]](https://code.visualstudio.com/docs/getstarted/settings)

> **engineRootPath is required** and should point to the root folder for the engine version you are using (*.../Epic Games/UE_4.17*). This folder should include **Engine / FeaturePacks / Samples / Templates** sub folders.

4) For C++ language support, debug support, and IntelliSense install [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension.

Edit your project
----
Setup:
1) Install [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension. This provides support for c++ language and IntelliSense.

2) Run **Generate CppTools Configuration**. This will generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) configuration for your project. [[?]](https://code.visualstudio.com/docs/languages/cpp)

3) Run **Generate Task Configurations**. This will generate editor tasks for your project.

Command **Search Unreal Engine Online Documentation** : Search Unreal Engine Online Documentation for selected text.

Task **Open *Project* With Editor [*Development/GameDebug* *Editor*]** : Open build of your project with Unreal Editor.

Task **Run *Project* With Editor [*Development/GameDebug* *Editor*]** : Run build of your project with Unreal Editor.

Task **Launch Unreal Editor** : Launch Unreal Editor

Build your project
-----
Setup:
1) Run **Generate Task Configurations**. This will generate build tasks for your project. [[?]](https://docs.unrealengine.com/latest/INT/Programming/Development/CompilingProjects/index.html)

> The generated build task configurations matrix is determined by the settings **buildConfigurations** and **buildConfigurationTargets** 

2) Customize tasks. [[?]](https://code.visualstudio.com/docs/editor/tasks#_custom-tasks)

3) Run tasks. [[?]](https://code.visualstudio.com/docs/editor/tasks)

Task **Generate *Project* Project Files** : Generate project files for your project. [[?]](https://docs.unrealengine.com/latest/INT/Programming/UnrealBuildSystem/ProjectFileGenerator/index.html)

Task **Build *Project* [*buildConfigurations* *buildConfigurationTargets*]** Build your project.

Task **Clean *Project* [*buildConfigurations* *buildConfigurationTargets*]** Clean your project.

Task **Rebuild *Project* [*buildConfigurations* *buildConfigurationTargets*]** Clean and build your project.

Debug your project
-----
Setup:
1) Install [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension. This provides support for c++ debuggers. [[?]](https://code.visualstudio.com/docs/languages/cpp#_debugging)

2) Run **Generate Debug Configurations**. This will generate [CppTools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) launch configurations for your project.

3) Customize configurations. [[?]](https://github.com/Microsoft/vscode-cpptools/blob/master/launch.md)

4) Debug with the [VSCode](https://code.visualstudio.com/) integrated debugger. [[?]](https://code.visualstudio.com/docs/editor/debugging)

Debug **Attach Editor *Project* [GameDebug Editor]** : Attach debug session to open editor.

> Editor must be opened with *[GameDebug Editor]* build of your project.

Debug **Launch Editor *Project* [GameDebug Editor]** : Launch editor debug session.

Debug **Launch *Project* [GameDebug Editor]** : Launch debug session without open editor.

Advanced Settings *(you probably shouldn't touch these)*
-----------------

__ue4-cpptools.overrideUnrealBuildTool__ : Advanced - Override the command to run Unreal Build Tool.

__ue4-cpptools.overrideUnrealEditor__ : Advanced - Override the command to run Unreal Editor.

Known Issues
------------

[https://github.com/christopherreed/ue4-cpptools/issues](https://github.com/christopherreed/ue4-cpptools/issues)

* Mac untested - implemenations are 'best guess' at the moment

* CppTools IntelliSense not working

* Unreal Editor doesn't Hot Reload code on Linux

* Generate CppTools Configuration will only include default system configuration if it is present in c_cpp_properties.json at generation time

* Generate CppTools Configuration will only include intermediate include paths if the folders are present at generation time

* Relies on the Unreal Build Tool CodeLite project generator

License
-------

This software is licensed under the MIT License, see LICENSE for more information

<a href='https://ko-fi.com/A41034HG' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
