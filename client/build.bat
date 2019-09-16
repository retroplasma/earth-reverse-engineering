@echo off

call "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" x64

set TARGET=main

set SDL2_INCLUDE=/I "C:\lib\SDL2-2.0.8\include"
set PROTOBUF_INCLUDE=/I "C:\lib\protobuf-3.9.1\src"
set GLAD_INCLUDE=/I "gl2\include"
set IMGUI_INCLUDE=/I "C:\lib\imgui-1.72b"
set INCLUDE_DIRS=%SDL2_INCLUDE% %PROTOBUF_INCLUDE% %GLAD_INCLUDE% %IMGUI_INCLUDE%

set LIB_SDL2=/LIBPATH:"C:\lib\SDL2-2.0.8\lib\x64" SDL2.lib SDL2main.lib
set LIB_PROTOBUF=/LIBPATH:"C:\lib\protobuf-3.9.1\cmake\build\x64\MinSizeRel" libprotobuf.lib
if not exist SDL2.dll copy "C:\lib\SDL2-2.0.8\lib\x64\SDL2.dll" SDL2.dll

set LINK_LIBRARIES=%LIB_SDL2% %LIB_PROTOBUF% user32.lib opengl32.lib kernel32.lib

set CFLAGS=/DDEBUG /ZI /Fd%TARGET%.pdb %INCLUDE_DIRS%
set LDFLAGS=/SUBSYSTEM:console /INCREMENTAL:no /OUT:%TARGET%.exe %LINK_LIBRARIES%

if exist %TARGET%.pdb del %TARGET%.pdb
cl %CFLAGS% main.cpp /link %LDFLAGS%
mt.exe -manifest app.manifest -outputresource:%TARGET%.exe;1
del main.obj
