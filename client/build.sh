#!/bin/sh

if [ "$1" == "emscripten" ]; then
	source config_emscripten.sh
	echo build: emscripten
	pwd="$(pwd)" && cd .. && $EMSCRIPTEN_PROTOBUF_EXE --cpp_out=client proto/rocktree.proto && cd "$pwd"
	cd crn && emcc -std=c++14 -c crn.cc -w && cd ..

	emcc -Iinclude main.cpp -O2 -std=c++14 -I. -I./eigen/ \
		-I$EMSCRIPTEN_PROTOBUF_SRC $EMSCRIPTEN_PROTOBUF_LIB crn/crn.o \
		-s USE_SDL=2 -s FETCH=1 -s TOTAL_MEMORY=1073741824 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=4 \
		-o main.html	
else
	echo build: native
	pwd="$(pwd)" && cd .. && protoc --cpp_out=client proto/rocktree.proto && cd "$pwd"
	cd crn && g++ -std=c++14 -c crn.cc -w && cd ..

	CFLAGS="--std=c++14 -g -I. `pkg-config --cflags sdl2 protobuf` -I./eigen/"
	LDFLAGS="`pkg-config --libs sdl2 protobuf` crn/crn.o"
	if [ `uname` = "Darwin" ]; then		
		CFLAGS="$CFLAGS `pkg-config --cflags glew`"
		LDFLAGS="$LDFLAGS `pkg-config --static --libs glew` -framework OpenGL"
		echo "$CFLAGS"
		echo "$LDFLAGS"
	else
		CFLAGS="$CFLAGS -Igl2/include"
		LDFLAGS="$LDFLAGS -lGL -lm -ldl"
	fi
	c++ $CFLAGS main.cpp $LDFLAGS -o main
fi
