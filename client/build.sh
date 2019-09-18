#!/bin/sh
CFLAGS="--std=c++11 -g -I. `pkg-config --cflags sdl2 protobuf` -I./imgui"
LDFLAGS="`pkg-config --libs sdl2 protobuf`"
if [ `uname` = "Darwin" ]; then
	LDFLAGS="$LDFLAGS -framework OpenGL"
else
	CFLAGS="$CFLAGS -Igl2/include"
	LDFLAGS="$LDFLAGS -lGL -lm -ldl"
fi
c++ $CFLAGS main.cpp $LDFLAGS -o main