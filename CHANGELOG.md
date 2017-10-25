Change Log
==========
v0.1.2
------
Added setting *engineVersion* for 4.18 compatibility

Fixed project file generation for 4.18 using *engineVersion* setting

v0.1.1
------
Fixed Generate Task Configurations command will now display error messages

v0.1.0
------

Added Generate Debug Configurations command. Running the command will update launch.json with debug configurations: 
* *configurationName* : Attach Editor *Project* [GameDebug Editor]
* *configurationName* : Launch Editor *Project* [GameDebug Editor]
* *configurationName* : Launch *Project* [GameDebug Editor]

Added Generate Task Configurations command. Running the command will update tasks.json with task configurations:
* *configurationName* : Generate *Project* Project Files
* *configurationName* : Open *Project* With Editor
* *configurationName* : Run *Project* With Editor
* *configurationName* : Launch Unreal Editor
* *configurationName* : Build *Project* [*buildConfigurations* *buildConfigurationTargets*]
* *configurationName* : Clean *Project* [*buildConfigurations* *buildConfigurationTargets*]
* *configurationName* : Rebuild *Project* [*buildConfigurations* *buildConfigurationTargets*]

Added settings:
* *configurationName* - name for task, debug, and cppTools configurations
* *buildConfigurations* - build configurations to generate task configurations for
* *buildConfigurationTargets* - build configuration targets to generate task configurations for

Removed settings:
* *buildConfiguration* - use *buildConfigurations*
* *buildConfigurationTarget* - use *buildConfigurationTargets*
* *cppToolsConfiguration* - use *configuratinName*
* *recycleTerminal* - removed terminal related stuff
* *buildPlatform* - current platform only

Other:
* Removed terminal related stuff
* Bumped minimum vscode version to 1.15
* Added intermediate include paths to generated cppTool configuration
* Added default system configuration to generated cppTool configuration

