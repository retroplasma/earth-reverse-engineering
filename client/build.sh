#!/bin/sh
CFLAGS="--std=c++11 -g -I. `pkg-config --cflags sdl2 protobuf`"
LDFLAGS="`pkg-config --libs sdl2 protobuf`"
c++ $CFLAGS main.cpp $LDFLAGS -o main