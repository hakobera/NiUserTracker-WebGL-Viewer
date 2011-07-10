OSTYPE := $(shell uname -s)

BIN_DIR = ../Bin

INC_DIRS = ../../Include /usr/include/ni

SRC_FILES = \
	main.cpp \
	SceneDrawer.cpp	 \
	network.cpp

EXE_NAME = Sample-NiWebGLUserTracker

ifneq "$(GLES)" "1"
ifeq ("$(OSTYPE)","Darwin")
	LDFLAGS += -framework OpenGL -framework GLUT
else
	USED_LIBS += glut
endif
else
	DEFINES += USE_GLES
	USED_LIBS += GLES_CM IMGegl srv_um
	SRC_FILES += opengles.cpp
endif

USED_LIBS += OpenNI

LIB_DIRS += ../../Lib
include ../../Include/CommonMakefile

