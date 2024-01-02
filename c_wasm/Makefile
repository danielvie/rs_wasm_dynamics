# CONFIG FLAGS COMPILER
CXX           = g++
CC            = gcc

INCLUDE       = -Isrc -Ilib -Iinclude -I"~/Downloads/emsdk/upstream/emscripten/system/include"
DECLARE       = 

CFLAGS       = -O0 -g -Wall ${INCLUDE} ${DECLARE}
CXXFLAGS     = -O0 -std=c++17 -g -Wall ${INCLUDE} ${DECLARE}
LDFLAGS      = 

# DEFINE NAME LIB 'python' AND 'exe'
app           = main.exe

# BREAKLINE CONSTANT
ifeq (${OS},Windows_NT)
break_line = \\\\\\n
else
break_line = \\\\n
endif

# READ FILES
src           = $(wildcard src/*.c*)
lib           = $(wildcard lib/*.c*)

# ADJUST 'src' E 'obj'
obj           = $(addsuffix .o,$(basename $(src:src/%=obj/%)))
obj          += $(addsuffix .o,$(basename $(lib:lib/%=obj/%)))

# COMPILATION LAW
all: r

r: run

p: 
	@echo -----------------------------
	@echo ${src}
	@echo -----------------------------
	@echo ${obj}
	@echo -----------------------------

# ADJUST FLAGS 'python'
lib: ${pyd}

# COMPILATION 'app {exe}'
${app}: ${obj}
	$(CC) -o ${app} ${obj}

# WRITE '*.o' IN 'obj'
obj/%.o : src/%.c
	$(CC) ${CFLAGS} -o $@ -c $<

obj/%.o : lib/%.c
	$(CC) ${CFLAGS} -o $@ -c $<

# MONITOR CHANGES IN '.h'
# obj/test.o : src/test.h

# INITIALIZE PATHS
init: create_folders
init: create_main
init: create_readme

i: init

f: create_folders

m: create_main

re: create_readme

res: reset

.SILENT: create_folders
create_folders:
	mkdir obj src include lib

.SILENT: create_main
create_main:
	printf "#include <iostream>\n\n" > src/main.cpp
	printf "int main(int argc, char const *argv[])\n" >> src/main.cpp
	printf "{\n" >> src/main.cpp
	printf "	std::cout << \"-----------------------------------------${break_line}\";\n" >> src/main.cpp
	printf "	std::cout << \"hello${break_line}\";\n" >> src/main.cpp
	printf "	return 0;\n" >> src/main.cpp
	printf "}" >> src/main.cpp

.SILENT: create_readme
create_readme:
	printf "\n### REF\n" > README.md

run: ${app}
	./${app}

clean: 
	rm obj/*

res: reset

reset:
	rm -rf *

bw:
	emcc lib/add.c lib/invert_matrix.c -o ../www/public/add.wasm -s EXPORTED_FUNCTIONS="['_add']" --no-entry